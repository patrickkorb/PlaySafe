import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Datenschutzerklärung | PlaySafe",
    description:
        "Informationen zum Datenschutz bei PlaySafe – wie wir personenbezogene Daten verarbeiten, insbesondere bei Nutzung des Versicherungsrechners und der Angebotsanfrage.",
    robots: { index: true, follow: true },
};

function InfoBox({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 my-2 text-sm">
            <span className="font-semibold text-secondary shrink-0">{label}:</span>
            <span className="text-gray-700">{children}</span>
        </div>
    );
}

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold shrink-0">
                    {number}
                </span>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            <div className="pl-11 space-y-3 text-gray-700 leading-relaxed">
                {children}
            </div>
        </section>
    );
}

function SubSection({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
    return (
        <div id={id} className="mt-5">
            <h3 className="font-semibold text-gray-900 mb-2 text-base">{title}</h3>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

const toc = [
    { id: "verantwortlicher", label: "Verantwortlicher" },
    { id: "erhebung", label: "Erhebung personenbezogener Daten" },
    { id: "gesundheitsdaten", label: "Besondere Datenkategorien (Gesundheitsdaten)" },
    { id: "weitergabe", label: "Weitergabe von Daten" },
    { id: "cookies", label: "Cookies und lokaler Speicher" },
    { id: "meta-pixel", label: "Meta Pixel & Conversion API" },
    { id: "datafast", label: "Reichweitenmessung (Datafast)" },
    { id: "rechte", label: "Betroffenenrechte" },
    { id: "widerspruch", label: "Widerspruchsrecht" },
    { id: "datensicherheit", label: "Datensicherheit" },
    { id: "aktualitaet", label: "Aktualität" },
];

const processors = [
    {
        name: "Supabase Inc.",
        detail: "Datenbank-Hosting · Region Frankfurt, Deutschland · AVV nach Art. 28 DSGVO liegt vor",
    },
    {
        name: "n8n GmbH",
        detail: "Automatisierungsplattform (E-Mail-Versand, Lead-Verarbeitung) · Bürgerstraße 1, 10317 Berlin · Hosting: n8n Cloud (EU) · AVV nach Art. 28 DSGVO liegt vor",
    },
    {
        name: "Brevo (Sendinblue SAS)",
        detail: "E-Mail-Versand · 7 rue de Madrid, 75008 Paris · AVV nach Art. 28 DSGVO liegt vor",
    },
    {
        name: "SIGNAL IDUNA Gruppe",
        detail: "Versicherer · Joseph-Scherer-Straße 3, 44139 Dortmund · Empfänger der Angebots-/Antragsdaten zur Erstellung des Versicherungsangebots",
    },
];

export default function DatenschutzPage() {
    return (
        <main>
            <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Datenschutzerklärung</h1>
                    <p className="text-sm text-gray-400">Stand: Juni 2026</p>
                </div>

                {/* Inhaltsverzeichnis */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Inhalt</p>
                    <ol className="space-y-1.5">
                        {toc.map((item, i) => (
                            <li key={item.id}>
                                <a
                                    href={`#${item.id}`}
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors group"
                                >
                                    <span className="text-gray-400 group-hover:text-primary w-5 text-right shrink-0">{i + 1}.</span>
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>

                <p className="text-gray-600 leading-relaxed">
                    Wir freuen uns über Ihr Interesse an unserem Versicherungsangebot. Der Schutz Ihrer
                    personenbezogenen Daten ist uns wichtig. Nachfolgend informieren wir Sie ausführlich
                    über den Umgang mit Ihren Daten.
                </p>

                <div className="space-y-10 divide-y divide-gray-100">

                    {/* 1 */}
                    <Section id="verantwortlicher" number="1" title="Verantwortlicher">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm space-y-1">
                            <p className="font-semibold text-gray-900">Mike Allmendinger</p>
                            <p>Generalagentur der SIGNAL IDUNA</p>
                            <p>Friedrichsplatz 6, 76133 Karlsruhe</p>
                            <p className="pt-1">Telefon: 0721 / 981010</p>
                            <p>
                                E-Mail:{" "}
                                <a href="mailto:mike.allmendinger@signal-iduna.net" className="text-primary hover:underline">
                                    mike.allmendinger@signal-iduna.net
                                </a>
                            </p>
                        </div>
                        <p className="text-sm text-gray-600">
                            „PlaySafe" ist eine Marke bzw. ein Online-Angebot der oben genannten
                            Generalagentur Mike Allmendinger und wird unter der Domain playsafe.fit
                            betrieben. Verantwortlicher im Sinne der DSGVO ist ausschließlich der
                            oben Genannte.
                        </p>
                    </Section>

                    {/* 2 */}
                    <Section id="erhebung" number="2" title="Erhebung und Speicherung personenbezogener Daten">
                        <SubSection id="logfiles" title="a) Beim Besuch der Website">
                            <p>
                                Beim Aufrufen unserer Website werden automatisch Informationen an unseren Server
                                gesendet und temporär in Logfiles gespeichert:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                                <li>IP-Adresse des anfragenden Rechners</li>
                                <li>Datum und Uhrzeit des Zugriffs</li>
                                <li>Name und URL der abgerufenen Datei</li>
                                <li>Referrer-URL (Website, von der der Zugriff erfolgt)</li>
                                <li>Verwendeter Browser, Betriebssystem, Access-Provider</li>
                            </ul>
                            <InfoBox label="Rechtsgrundlage">Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</InfoBox>
                            <InfoBox label="Speicherdauer">Logfiles werden nach 7 Tagen automatisch gelöscht.</InfoBox>
                        </SubSection>

                        <SubSection id="kontaktformular" title="b) Bei Nutzung des Kontaktformulars oder E-Mail-Kontakts">
                            <p>
                                Ihre Angaben werden zwecks Bearbeitung der Anfrage und für Anschlussfragen
                                gespeichert. Eine Weitergabe ohne Ihre Einwilligung findet nicht statt.
                            </p>
                            <InfoBox label="Rechtsgrundlage">
                                Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) bzw. lit. f bei sonstigen Anfragen
                            </InfoBox>
                        </SubSection>

                        <SubSection id="rechner" title="c) Versicherungsrechner und Lead-Generierung">
                            <p>Im Rahmen unseres Versicherungsrechners verarbeiten wir folgende Daten:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                                <li>Vorname, ggf. Nachname</li>
                                <li>Geburtsdatum &amp; Geschlecht</li>
                                <li>Telefonnummer &amp; E-Mail-Adresse</li>
                                <li>Sportart, Häufigkeit, gewählter Tarif</li>
                                <li>Versicherung für (sich selbst, Kind, Partner etc.)</li>
                            </ul>
                            <InfoBox label="Zweck">
                                Erstellung eines individuellen Versicherungsangebots und ggf. Vermittlung an SIGNAL IDUNA
                            </InfoBox>
                            <InfoBox label="Rechtsgrundlage">
                                Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) für Kontaktaufnahme; lit. b (Vertragsanbahnung) für Angebotserstellung
                            </InfoBox>
                            <InfoBox label="Speicherdauer">
                                Bis zu 24 Monate ab Einwilligung; bei Vertragsabschluss gelten gesetzliche Fristen (bis 10 Jahre)
                            </InfoBox>
                            <div className="text-sm space-y-2 mt-1">
                                <p className="font-semibold text-gray-800">Auftragsverarbeiter:</p>
                                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                                    {processors.map((p) => (
                                        <div key={p.name} className="px-4 py-3">
                                            <p className="font-medium text-gray-900">{p.name}</p>
                                            <p className="text-gray-500 text-xs mt-0.5">{p.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SubSection>

                        <SubSection id="angebot" title="d) Angebotsformular">
                            <p>
                                Wenn Sie über unser Angebotsformular einen Versicherungsantrag anfordern,
                                verarbeiten wir umfangreichere Daten, da diese für die Antragserstellung
                                bei SIGNAL IDUNA erforderlich sind:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mt-1">
                                {[
                                    "Anrede, Vor- &amp; Nachname",
                                    "Geburtsdatum",
                                    "Berufsstand &amp; Tätigkeit",
                                    "E-Mail &amp; Telefonnummer",
                                    "Vollständige Adresse (Straße, PLZ, Ort)",
                                    "IBAN &amp; Kontoinhaber",
                                    "Gewählter Tarif &amp; Versicherungsbeginn",
                                    "Beziehung zur versicherten Person (bei Fremdversicherung)",
                                    "Angaben zur versicherten Person (bei Fremdversicherung)",
                                    "Einwilligungen (Datenschutz, Kontakt, Risikoausschluss)",
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                                        <span className="text-primary mt-0.5 shrink-0">✓</span>
                                        <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: item }} />
                                    </div>
                                ))}
                            </div>
                            <InfoBox label="Zweck">
                                Erstellung und Übermittlung eines individuellen Versicherungsantrags an SIGNAL IDUNA
                            </InfoBox>
                            <InfoBox label="Rechtsgrundlage">
                                Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung); lit. a (Einwilligung) für Kontaktaufnahme
                            </InfoBox>
                            <InfoBox label="Speicherdauer">
                                Bis zu 24 Monate; bei Vertragsabschluss bis zu 10 Jahre (gesetzliche Aufbewahrungsfristen)
                            </InfoBox>
                            <div className="text-sm space-y-2 mt-1">
                                <p className="font-semibold text-gray-800">Auftragsverarbeiter:</p>
                                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                                    {processors.map((p) => (
                                        <div key={p.name} className="px-4 py-3">
                                            <p className="font-medium text-gray-900">{p.name}</p>
                                            <p className="text-gray-500 text-xs mt-0.5">{p.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SubSection>

                        <SubSection id="benachrichtigung" title="e) Interne Benachrichtigung">
                            <p>
                                Zur technischen Überwachung des Eingangs von Anfragen versenden wir eine
                                interne Benachrichtigung an den Betreiber der Website. Diese enthält
                                <strong> keine Kundendaten</strong>, sondern lediglich Eckdaten wie den
                                gewählten Tarif und den gewünschten Versicherungsbeginn.
                            </p>
                            <InfoBox label="Rechtsgrundlage">Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem funktionierenden Betrieb)</InfoBox>
                        </SubSection>
                    </Section>

                    {/* Gesundheitsdaten / Art. 9 */}
                    <Section id="gesundheitsdaten" number="3" title="Besondere Kategorien personenbezogener Daten (Gesundheitsdaten)">
                        <p>
                            Im Zusammenhang mit der Vermittlung einer Unfall-/Sportversicherung verarbeiten
                            wir ggf. Angaben, die als Gesundheitsdaten im Sinne des Art. 9 DSGVO einzuordnen
                            sind – etwa Ihre Bestätigung zu Risikoausschlüssen (z. B. dass keine
                            Pflegebedürftigkeit und kein erhöhtes gesundheitliches Risiko besteht) sowie
                            Angaben zu Sportart und -häufigkeit.
                        </p>
                        <InfoBox label="Rechtsgrundlage">
                            Art. 9 Abs. 2 lit. a DSGVO (ausdrückliche Einwilligung). Sie erteilen diese
                            Einwilligung durch das Absenden des Formulars und die Bestätigung der
                            entsprechenden Erklärungen.
                        </InfoBox>
                        <InfoBox label="Zweck">
                            Beurteilung der Versicherbarkeit und Erstellung eines passenden Angebots durch
                            die SIGNAL IDUNA
                        </InfoBox>
                        <InfoBox label="Widerruf">
                            Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen
                            (Kontaktdaten siehe Punkt 1).
                        </InfoBox>
                    </Section>

                    {/* 3 */}
                    <Section id="weitergabe" number="4" title="Weitergabe von Daten">
                        <p>Eine Übermittlung Ihrer Daten an Dritte findet nur statt, wenn:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                            <li>Sie Ihre ausdrückliche Einwilligung erteilt haben (Art. 6 Abs. 1 lit. a)</li>
                            <li>die Verarbeitung für die Vertragsabwicklung erforderlich ist (lit. b)</li>
                            <li>eine rechtliche Verpflichtung besteht (lit. c)</li>
                            <li>die Weitergabe zur Wahrung berechtigter Interessen nötig ist (lit. f)</li>
                        </ul>
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm mt-2">
                            <p>
                                Bei Vertragsabschluss werden Ihre Daten an die{" "}
                                <strong>SIGNAL IDUNA Allgemeine Versicherung AG</strong>, Joseph-Scherer-Straße 3,
                                44139 Dortmund übermittelt (Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO).
                            </p>
                            <a
                                href="https://www.signal-iduna.de/datenschutz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-xs mt-1 inline-block"
                            >
                                Datenschutzhinweise der SIGNAL IDUNA →
                            </a>
                        </div>
                    </Section>

                    {/* 4 */}
                    <Section id="cookies" number="5" title="Cookies und lokaler Speicher">
                        <p>Wir unterscheiden zwischen technisch notwendigen und optionalen Cookies:</p>
                        <div className="space-y-2 mt-1">
                            {[
                                {
                                    name: "cookie_consent",
                                    type: "localStorage",
                                    desc: "Speichert Ihre Cookie-Präferenz (akzeptiert/abgelehnt).",
                                    badge: "Technisch notwendig",
                                },
                                {
                                    name: "playsafe_rechner",
                                    type: "localStorage",
                                    desc: "Speichert den Rechner-Fortschritt für 14 Tage.",
                                    badge: "Technisch notwendig",
                                },
                                {
                                    name: "Analyse- & Marketing-Cookies",
                                    type: "Meta Pixel, Datafast",
                                    desc: "Nur nach ausdrücklicher Einwilligung aktiv. Siehe Abschnitt 6 und 7.",
                                    badge: "Nur mit Einwilligung",
                                    badgeColor: "bg-amber-100 text-amber-700",
                                },
                            ].map((c) => (
                                <div key={c.name} className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm">
                                    <div className="flex items-start justify-between gap-2 flex-wrap">
                                        <div>
                                            <span className="font-mono font-semibold text-gray-900">{c.name}</span>
                                            <span className="text-gray-400 ml-2 text-xs">{c.type}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badgeColor ?? "bg-green-100 text-green-700"}`}>
                                            {c.badge}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mt-1">{c.desc}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Sie können Ihren Browser so einstellen, dass Cookies nur im Einzelfall erlaubt werden.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800 mt-2">
                            <span className="font-semibold">Widerruf:</span> Ihre einmal getroffene
                            Cookie-Entscheidung können Sie jederzeit über den Link
                            <strong> „Cookie-Einstellungen"</strong> im Footer der Website ändern oder
                            widerrufen – ebenso einfach, wie Sie die Einwilligung erteilt haben (Art. 7
                            Abs. 3 DSGVO).
                        </div>
                    </Section>

                    {/* 5 */}
                    <Section id="meta-pixel" number="6" title="Meta Pixel und Meta Conversion API">
                        <p>
                            Wir setzen den <strong>Meta Pixel</strong> (ehemals Facebook Pixel) sowie die{" "}
                            <strong>Meta Conversion API (CAPI)</strong> ein, um den Erfolg unserer Werbeanzeigen zu
                            messen und zu optimieren.
                        </p>

                        <SubSection title="a) Meta Pixel (browser-seitig)">
                            <p>
                                Der Meta Pixel wird nach Ihrer Einwilligung in Ihrem Browser aktiviert und
                                übermittelt Seitenaufrufe sowie bestimmte Aktionen an Meta. Dabei können Cookies
                                gesetzt werden (<code className="bg-gray-100 px-1 rounded text-xs">_fbp</code>,{" "}
                                <code className="bg-gray-100 px-1 rounded text-xs">_fbc</code>).
                            </p>
                            <InfoBox label="Einwilligung">
                                Nur aktiv nach Klick auf „Alle akzeptieren" im Cookie-Banner. Widerruf durch „Ablehnen" oder Löschen der Browser-Cookies.
                            </InfoBox>
                        </SubSection>

                        <SubSection title="b) Meta Conversion API (server-seitig)">
                            <p>
                                Die CAPI übermittelt Conversion-Ereignisse direkt von unserem Server an Meta –
                                <strong> ausschließlich dann</strong>, wenn Sie hierfür im Lead-Formular die
                                gesonderte, freiwillige Marketing-Einwilligung erteilt haben. Ohne diese
                                Einwilligung findet keine Übermittlung an Meta statt.
                            </p>
                            <InfoBox label="Übermittelte Daten">
                                Gehashte E-Mail &amp; Telefonnummer (SHA-256), gehashter Vor-/Nachname, IP-Adresse,
                                Browser-Kennung sowie ggf. die Cookies _fbp/_fbc, Event-Typ (z. B. „Lead")
                            </InfoBox>
                            <InfoBox label="Zweck">Messung und Optimierung unserer Werbekampagnen auf Facebook und Instagram</InfoBox>
                            <InfoBox label="Rechtsgrundlage">
                                Art. 6 Abs. 1 lit. a DSGVO (Einwilligung); für die Übermittlung in die USA
                                zusätzlich Art. 49 Abs. 1 lit. a DSGVO (ausdrückliche Einwilligung in die
                                Datenübermittlung in ein Drittland)
                            </InfoBox>
                            <InfoBox label="Empfänger">
                                Meta Platforms Ireland Ltd., Merrion Road, Dublin 4 – Datenübertragung in die USA.
                                Meta ist unter dem EU-US Data Privacy Framework zertifiziert; ergänzend bestehen
                                EU-Standardvertragsklauseln.
                            </InfoBox>
                            <InfoBox label="Widerruf">
                                Jederzeit mit Wirkung für die Zukunft möglich – über „Cookie-Einstellungen" im
                                Footer oder per Nachricht an die unter Punkt 1 genannten Kontaktdaten.
                            </InfoBox>
                            <InfoBox label="Speicherdauer">Bis zu 180 Tage bei Meta</InfoBox>
                            <p className="text-sm">
                                Opt-out:{" "}
                                <a
                                    href="https://www.facebook.com/settings?tab=ads"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    facebook.com/settings?tab=ads
                                </a>{" "}
                                &middot;{" "}
                                <a
                                    href="https://www.facebook.com/privacy/policy/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    Datenschutzrichtlinie Meta
                                </a>
                            </p>
                        </SubSection>
                    </Section>

                    {/* 7 */}
                    <Section id="datafast" number="7" title="Reichweitenmessung mit Datafast">
                        <p>
                            Zur statistischen Auswertung der Nutzung unserer Website setzen wir den
                            Analysedienst <strong>Datafast</strong> ein. Datafast wird – ebenso wie der
                            Meta Pixel – ausschließlich nach Ihrer Einwilligung über das Cookie-Banner
                            geladen.
                        </p>
                        <InfoBox label="Übermittelte Daten">
                            Anonymisierte Nutzungsdaten (z. B. aufgerufene Seiten, Funnel-Schritte, Tarif).
                            Es werden <strong>keine</strong> Klardaten wie Name, E-Mail oder Telefonnummer
                            an Datafast übermittelt.
                        </InfoBox>
                        <InfoBox label="Zweck">Statistische Auswertung und Verbesserung unseres Angebots</InfoBox>
                        <InfoBox label="Rechtsgrundlage">Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</InfoBox>
                        <InfoBox label="Widerruf">
                            Jederzeit über „Cookie-Einstellungen" im Footer möglich.
                        </InfoBox>
                    </Section>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600">
                        <span className="font-semibold text-gray-800">Hinweis zu Schriftarten &amp; Videos:</span>{" "}
                        Verwendete Schriftarten werden lokal von unserem Server ausgeliefert; es erfolgt
                        keine Verbindung zu Google. Auf der Website eingebundene Videos werden direkt von
                        unserem eigenen Server bereitgestellt – es findet keine Übermittlung an Dritte
                        (z. B. YouTube/Google) statt.
                    </div>

                    {/* 8 */}
                    <Section id="rechte" number="8" title="Betroffenenrechte">
                        <p>Sie haben folgende Rechte gegenüber uns:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                            {[
                                { right: "Auskunft", art: "Art. 15" },
                                { right: "Berichtigung", art: "Art. 16" },
                                { right: "Löschung", art: "Art. 17" },
                                { right: "Einschränkung", art: "Art. 18" },
                                { right: "Datenübertragbarkeit", art: "Art. 20" },
                                { right: "Widerruf der Einwilligung", art: "Art. 7 Abs. 3" },
                                { right: "Beschwerde bei Aufsichtsbehörde", art: "Art. 77" },
                            ].map((r) => (
                                <div key={r.right} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                    <span className="text-gray-800">{r.right}</span>
                                    <span className="text-xs text-gray-400 font-mono">{r.art} DSGVO</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm mt-2">
                            Zur Ausübung Ihrer Rechte genügt eine formlose Mitteilung an die unter Punkt 1 genannten Kontaktdaten.
                        </p>
                    </Section>

                    {/* 9 */}
                    <Section id="widerspruch" number="9" title="Widerspruchsrecht">
                        <p>
                            Sofern Ihre Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeitet werden,
                            haben Sie das Recht, gemäß Art. 21 DSGVO Widerspruch einzulegen.
                        </p>
                    </Section>

                    {/* 10 */}
                    <Section id="datensicherheit" number="10" title="Datensicherheit">
                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800">
                            <span className="text-xl">🔒</span>
                            <span>Alle Datenübertragungen auf unserer Website sind durch <strong>SSL/TLS-Verschlüsselung</strong> gesichert.</span>
                        </div>
                    </Section>

                    {/* 11 */}
                    <Section id="aktualitaet" number="11" title="Aktualität dieser Datenschutzerklärung">
                        <p>
                            Diese Datenschutzerklärung hat den Stand <strong>Juni 2026</strong>. Wir behalten uns
                            vor, sie bei Bedarf zu aktualisieren. Die jeweils aktuelle Version ist stets auf dieser
                            Seite abrufbar.
                        </p>
                    </Section>

                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-gray-500">
                    <p>
                        Fragen zum Datenschutz?{" "}
                        <a href="mailto:mike.allmendinger@signal-iduna.net" className="text-primary hover:underline font-medium">
                            mike.allmendinger@signal-iduna.net
                        </a>
                    </p>
                    <Link href="/" className="text-primary hover:underline">
                        ← Zurück zur Startseite
                    </Link>
                </div>
            </div>
        </main>
    );
}
