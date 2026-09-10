# Auftrag: Direktabschlüsse von playsafe.fit in eine Supabase-Tabelle schreiben

## Warum das genau sein muss

Beim Absenden des Formulars entsteht eine Zeile in einer Supabase-Tabelle. Eine
Automation auf einem anderen Rechner holt sie sich innerhalb von Minuten ab,
füllt damit **unbeaufsichtigt** einen Antrag im Produktcenter des Versicherers
aus und **verschickt eine verbindliche Signatureinladung an den Kunden**. Es
sieht niemand drüber.

Daraus folgt alles Weitere: Ein falscher Wert landet in einem Vertrag, den ein
Kunde unterschreibt. Ein fehlender Wert lässt den Fall liegen, und der Kunde
wartet vergeblich. Also keine Ersatzwerte, keine Vorbelegungen, keine „ungefähr
passenden" Formate — lieber den Kunden im Formular nachbessern lassen als eine
unvollständige Zeile schreiben.

## Was zu bauen ist

Genau eine Sache: Beim erfolgreichen Absenden des Direktabschluss-Formulars
**eine Zeile** in `public.abschluesse` einfügen. Kein weiterer Aufruf, keine
Mail, keine Statusabfrage — das erledigt die Gegenseite.

## Die Tabelle

Falls das Supabase-Projekt noch nicht existiert, anlegen. Migration:

```sql
create table if not exists public.abschluesse (
  id              uuid        primary key default gen_random_uuid(),
  eingegangen_am  timestamptz not null default now(),
  sparte          text        not null default 'unfallversicherung',
  daten           jsonb       not null,
  status          text        not null default 'neu'
                  check (status in ('neu','laeuft','fertig','abgelehnt','abgebrochen')),
  versuche        int         not null default 0,
  lauf_id         uuid,
  begonnen_am     timestamptz,
  beendet_am      timestamptz,
  meldung         text,
  quelle_id       text        not null unique
);

create index if not exists abschluesse_offen_idx
  on public.abschluesse (status, eingegangen_am);
```

Die Webseite schreibt **nur** `daten`, `sparte` und `quelle_id`. Alles andere
setzt die Gegenseite — nicht mitschreiben, auch nicht mit dem Vorgabewert.

## Der Inhalt von `daten`

Ein flaches JSON-Objekt. Schlüssel exakt so benannt, alle Werte Strings, alle
getrimmt. Keine `null`, keine leeren Strings, keine Verschachtelung.

| Schlüssel | Inhalt | Format — hart geprüft |
|---|---|---|
| `vn_anrede` | Anrede Versicherungsnehmer | exakt `Herr` oder `Frau` |
| `vn_name` | Vor- und Nachname zusammen | `Thomas Berger` |
| `vn_geburtsdatum` | | **`TT.MM.JJJJ`**, zweistellig mit führender Null: `05.04.1980`. `5.4.1980` wird abgelehnt |
| `vn_berufsstand` | | Freitext: `Arbeitnehmer/-in`, `Student`, `Rentner/-in`, `Selbstständig` … |
| `vn_taetigkeit` | ausgeübter Beruf | Freitext: `Softwareentwickler`. Sonderregel siehe unten |
| `vp_anrede`, `vp_name`, `vp_geburtsdatum`, `vp_berufsstand`, `vp_taetigkeit` | dieselben fünf für die **versicherte Person** | wie oben |
| `adresse_strasse_hausnr` | | `Musterweg 159` |
| `adresse_plz` | | `76135` |
| `adresse_ort` | | `Karlsruhe` — muss zur PLZ passen, wird gegen einen Ortskatalog geprüft |
| `beziehung` | VP zum VN | exakt einer von `Selbst`, `Verheiratet`, `Lebensgemeinschaft`, `Kind`, `Sonstige` |
| `email` | | **Hierhin geht die Signatureinladung.** Der wichtigste Wert im Objekt |
| `telefon` | | `+4915100000000` |
| `iban` | | `DE02120300000000202051`, ohne Leerzeichen |
| `kontoinhaber` | | Name |
| `beginn_roh` | Vertragsbeginn | `Sofort` **oder** ein `TT.MM.JJJJ`, das auf den **1. eines Monats** fällt. Jeder andere Tag wird abgelehnt |
| `tarif_roh` | | `Small`, `Medium`, `Large` — optional mit Zusatz ` Kids`: `Medium Kids` |

**Sonderregel `vn_taetigkeit` / `vp_taetigkeit`:** Bei Schülern und Studenten
wird der Berufsstand selbst als Tätigkeit verwendet — dort darf der Wert leer
bleiben. Für **alle anderen ist er Pflicht**. Fehlt er, landet der Berufsstand
im Berufe-Katalog und aus „Arbeitnehmer/-in" wird der Katalogeintrag „Arbeit" —
ein falscher Beruf in einem unterschriebenen Vertrag. Das Formular fragt die
Tätigkeit bereits ab; sie muss nur mitgeschickt werden.

Eine `zielstufe` gehört **nicht** ins Objekt. Wie weit ein Abschluss läuft,
entscheidet allein die Gegenseite — die Webseite kann das nicht hochsetzen.

Beispiel:

```json
{
  "vn_anrede": "Herr",
  "vn_name": "Thomas Berger",
  "vn_geburtsdatum": "13.09.1992",
  "vn_berufsstand": "Arbeitnehmer/-in",
  "vn_taetigkeit": "Softwareentwickler",
  "vp_anrede": "Herr",
  "vp_name": "Thomas Berger",
  "vp_geburtsdatum": "13.09.1992",
  "vp_berufsstand": "Arbeitnehmer/-in",
  "vp_taetigkeit": "Softwareentwickler",
  "adresse_strasse_hausnr": "Musterweg 159",
  "adresse_plz": "76135",
  "adresse_ort": "Karlsruhe",
  "beziehung": "Selbst",
  "email": "thomas.berger@example.org",
  "telefon": "+4915100000000",
  "iban": "DE02120300000000202051",
  "kontoinhaber": "Thomas Berger",
  "beginn_roh": "Sofort",
  "tarif_roh": "Large"
}
```

## Idempotenz — der wichtigste Punkt

Doppelklick, Netzwerk-Wiederholung, Zurück-und-nochmal-Absenden: **jede
doppelte Zeile ist ein zweiter Vertrag beim selben Kunden.** Das ist der
teuerste Fehler, den dieser Code machen kann.

Deshalb erzeugt die Formularsitzung **eine** `quelle_id` (UUID, **beim Öffnen**
des Formulars, nicht beim Absenden) und schickt sie mit. Die `unique`-Bedingung
macht den zweiten Versuch zu einem Fehlschlag statt zu einem zweiten Antrag.

Ein Insert, der an dieser Bedingung scheitert, ist **kein Fehler für den
Kunden** — sein Antrag liegt bereits. Entsprechend behandeln: Erfolgsseite
zeigen, nicht Fehlermeldung.

## Zugang

- Der Insert passiert **serverseitig**, nie aus dem Browser heraus.
- Kein Service-Key im Frontend-Bundle.
- Row Level Security an. Die Rolle, mit der die Webseite schreibt, darf
  `insert` — sonst nichts. Kein `select` auf fremde Zeilen, kein `update`. Ein
  abhandengekommener Webseiten-Schlüssel darf weder Kundendaten auslesen noch
  Anträge umschreiben können.

## Was der Kunde nach dem Absenden sieht

Der Antrag ist nicht sofort da. Realistisch sind wenige Minuten; bei mehreren
gleichzeitigen Abschlüssen länger, und wenn die Automation gerade steht, dauert
es. Also: „Dein Antrag wird vorbereitet, du bekommst die Unterlagen zum
Unterschreiben per E-Mail." **Keine** Zusage über Sekunden und kein
Fortschrittsbalken, der etwas behauptet, was die Webseite nicht wissen kann.

## Eigene Prüfung vor dem Insert

Die Gegenseite prüft alles noch einmal und lehnt Fehlerhaftes ab — aber dann
steht der Kunde nicht mehr vor dem Formular und muss per Mail nachgefasst
werden. Besser gleich im Formular abfangen:

- Pflichtfelder vollständig, alle Werte getrimmt
- Datumsfelder im Format `TT.MM.JJJJ` mit führenden Nullen
- `beginn_roh`: `Sofort` oder ein Monatserster
- `beziehung` und `tarif_roh` aus einer festen Auswahlliste, nicht als Freitext
- **IBAN gegen die Prüfsumme (mod 97)** — die Gegenseite prüft sie *nicht*, ein
  Tippfehler bricht dort erst mitten im Antrag ab
- Tätigkeit gefüllt, außer bei Schüler/Student

## Abnahme

1. Ein Testabschluss erzeugt genau eine Zeile mit `status = 'neu'` und
   vollständigem `daten`-Objekt.
2. Zweimal absenden erzeugt weiterhin genau eine Zeile.
3. Ein Abschluss mit Berufsstand „Arbeitnehmer/-in" und leerer Tätigkeit kommt
   gar nicht erst bis zum Insert.
4. Das Frontend-Bundle enthält keinen Supabase-Schlüssel mit Schreibrechten.

## Was ich danach zurückbrauche

- Die Projekt-URL des Supabase-Projekts
- Einen Schlüssel für die Automationsseite, der `select` und `update` auf
  `abschluesse` darf (die Gegenseite muss Zeilen ziehen und ihren Ausgang
  zurückschreiben)
- Eine Bestätigung, dass die Tabelle exakt dem obigen Schema entspricht
