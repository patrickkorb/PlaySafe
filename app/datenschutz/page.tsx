import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Datenschutzerklärung | PlaySafe",
    description:
        "Informationen zum Datenschutz bei PlaySafe – wie wir personenbezogene Daten verarbeiten, insbesondere bei Nutzung des Versicherungsrechners und der WhatsApp-Kommunikation.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function DatenschutzPage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-16 md:py-24">
            <article className="prose prose-neutral max-w-none prose-headings:scroll-mt-24 prose-a:text-blue-600 hover:prose-a:underline">
                <h1>Datenschutzerklärung</h1>
                <p className="text-sm text-neutral-500">Stand: Mai 2026</p>

                <p>
                    Wir freuen uns über Ihr Interesse an unserem Versicherungsangebot. Der
                    Schutz Ihrer personenbezogenen Daten ist uns wichtig. Nachfolgend
                    informieren wir Sie ausführlich über den Umgang mit Ihren Daten.
                </p>

                {/* 1. Verantwortlicher */}
                <h2 id="verantwortlicher">1. Verantwortlicher</h2>
                <p>
                    Mike Allmendinger
                    <br />
                    Generalagentur der SIGNAL IDUNA
                    <br />
                    Friedrichsplatz 6
                    <br />
                    76133 Karlsruhe
                </p>
                <p>
                    Telefon: 0721 / 981010
                    <br />
                    E-Mail:{" "}
                    <a href="mailto:mike.allmendinger@signal-iduna.net">
                        mike.allmendinger@signal-iduna.net
                    </a>
                </p>

                {/* 2. Erhebung */}
                <h2 id="erhebung">2. Erhebung und Speicherung personenbezogener Daten</h2>

                <h3 id="logfiles">a) Beim Besuch der Website</h3>
                <p>
                    Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum
                    Einsatz kommenden Browser automatisch Informationen an den Server
                    unserer Website gesendet. Diese Informationen werden temporär in einem
                    sogenannten Logfile gespeichert:
                </p>
                <ul>
                    <li>IP-Adresse des anfragenden Rechners</li>
                    <li>Datum und Uhrzeit des Zugriffs</li>
                    <li>Name und URL der abgerufenen Datei</li>
                    <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                    <li>
                        Verwendeter Browser, ggf. Betriebssystem sowie der Name Ihres
                        Access-Providers
                    </li>
                </ul>
                <p>Diese Daten werden zu folgenden Zwecken verarbeitet:</p>
                <ul>
                    <li>Sicherstellung eines reibungslosen Verbindungsaufbaus</li>
                    <li>Komfortable Nutzung unserer Website</li>
                    <li>Auswertung der Systemsicherheit und -stabilität</li>
                    <li>Weitere administrative Zwecke</li>
                </ul>
                <p>
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
                    (berechtigtes Interesse).
                </p>
                <p>
                    <strong>Speicherdauer:</strong> Die Logfiles werden nach 7 Tagen
                    automatisch gelöscht, sofern sie nicht zur Aufklärung
                    sicherheitsrelevanter Vorfälle benötigt werden.
                </p>

                <h3 id="kontaktformular">b) Bei Nutzung des Kontaktformulars oder E-Mail-Kontakts</h3>
                <p>
                    Wenn Sie uns per Kontaktformular oder E-Mail Anfragen zukommen lassen,
                    werden Ihre Angaben zwecks Bearbeitung der Anfrage und für den Fall
                    von Anschlussfragen gespeichert. Diese Daten geben wir nicht ohne Ihre
                    Einwilligung weiter.
                </p>
                <p>
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
                    (Vertragsanbahnung) bzw. Art. 6 Abs. 1 lit. f DSGVO bei sonstigen
                    Anfragen.
                </p>

                <h3 id="rechner">c) Versicherungsrechner und Lead-Generierung</h3>
                <p>
                    Auf unserer Website bieten wir einen Versicherungsrechner an, mit dem
                    Sie ein unverbindliches Angebot für eine Unfallversicherung erstellen
                    können. Dabei verarbeiten wir die von Ihnen eingegebenen Daten:
                </p>
                <ul>
                    <li>Vorname, ggf. Nachname</li>
                    <li>Geburtsdatum</li>
                    <li>Telefonnummer</li>
                    <li>E-Mail-Adresse</li>
                    <li>Geschlecht</li>
                    <li>
                        Angaben zu Sportart, Sport-Häufigkeit, gewähltem Tarif und weiteren
                        Eingaben aus dem Rechner
                    </li>
                </ul>
                <p>
                    <strong>Zweck:</strong> Erstellung eines individuellen
                    Versicherungsangebots, Kontaktaufnahme zur Angebotsbesprechung sowie
                    ggf. Vermittlung des Versicherungsvertrags an die SIGNAL IDUNA
                    Allgemeine Versicherung AG.
                </p>
                <p>
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO
                    (Einwilligung) für die Kontaktaufnahme; Art. 6 Abs. 1 lit. b DSGVO
                    (Vertragsanbahnung) für die Angebotserstellung.
                </p>
                <p>
                    <strong>Speicherdauer:</strong> Ihre Lead-Daten werden gelöscht,
                    sobald der Zweck der Verarbeitung entfällt, spätestens jedoch nach 24
                    Monaten ab Ihrer Einwilligung. Im Falle eines Vertragsabschlusses
                    gelten die gesetzlichen Aufbewahrungsfristen (insbesondere § 257 HGB,
                    § 147 AO – bis zu 10 Jahre).
                </p>
                <p>
                    <strong>Auftragsverarbeiter:</strong> Ihre Daten werden in einer
                    Datenbank des Anbieters Supabase Inc. (Hosting-Region Frankfurt,
                    Deutschland) gespeichert. Mit Supabase besteht ein
                    Auftragsverarbeitungsvertrag nach Art. 28 DSGVO.
                </p>

                <h3 id="whatsapp-bot">d) Kommunikation per WhatsApp und KI-gestützter Chatbot</h3>
                <p>
                    Wenn Sie bei der Anfrage über unseren Versicherungsrechner Ihre
                    Einwilligung erteilt haben, kontaktieren wir Sie auf der Telefonnummer,
                    die Sie angegeben haben, per WhatsApp. Die Kommunikation auf WhatsApp
                    erfolgt teilweise automatisiert durch einen KI-gestützten Chatbot, der
                    auf Basis Ihrer Eingaben passende Antworten zu unseren
                    Versicherungsangeboten generiert.
                </p>
                <p>
                    <strong>Zweck:</strong> Beantwortung Ihrer Fragen zum
                    Versicherungsangebot, Qualifizierung Ihres Interesses, Vereinbarung
                    eines persönlichen Beratungstermins.
                </p>
                <p>
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO
                    (Einwilligung).
                </p>
                <p>
                    <strong>Verarbeitete Daten:</strong> Name, Telefonnummer
                    (WhatsApp-ID), Inhalt der WhatsApp-Nachrichten, von Ihnen im Rechner
                    angegebene Daten (z. B. Sportart, gewählter Tarif).
                </p>
                <p>
                    <strong>Empfänger und Drittlandtransfer:</strong>
                </p>
                <ul>
                    <li>
                        <strong>Meta Platforms Ireland Ltd.</strong> (WhatsApp Business
                        Platform), Merrion Road, Dublin 4, Irland. Die Nachrichten werden
                        über die Server von Meta verarbeitet, wobei eine Datenübertragung in
                        die USA stattfinden kann. Rechtsgrundlage für die Übermittlung:
                        Angemessenheitsbeschluss der EU-Kommission (EU-US Data Privacy
                        Framework, Art. 45 DSGVO).
                    </li>
                    <li>
                        <strong>OpenAI Ireland Ltd.</strong>, 1st Floor, The Liffey Trust
                        Centre, 117–126 Sheriff Street Upper, Dublin 1, Irland. OpenAI
                        stellt das KI-Modell zur Verfügung, das Antworten unseres Chatbots
                        generiert. Eine Datenverarbeitung in den USA findet statt;
                        Rechtsgrundlage wie oben.
                    </li>
                </ul>
                <p>
                    Mit allen genannten Empfängern bestehen Auftragsverarbeitungsverträge
                    nach Art. 28 DSGVO.
                </p>
                <p>
                    <strong>Hinweis zu KI-generierten Inhalten:</strong> Antworten unseres
                    Chatbots werden teilweise automatisiert durch ein KI-Sprachmodell
                    erzeugt. Sie können jederzeit das Gespräch mit einem menschlichen
                    Berater anfordern. Eine verbindliche Versicherungsberatung erfolgt
                    ausschließlich durch unseren menschlichen Berater im persönlichen
                    Gespräch.
                </p>
                <p>
                    <strong>Widerruf:</strong> Sie können Ihre Einwilligung jederzeit ohne
                    Angabe von Gründen widerrufen. Der einfachste Weg: Antworten Sie auf
                    WhatsApp mit „Stopp". Alternativ per E-Mail an{" "}
                    <a href="mailto:mike.allmendinger@signal-iduna.net">
                        mike.allmendinger@signal-iduna.net
                    </a>
                    . Nach Widerruf werden Sie nicht mehr kontaktiert; Ihre Daten werden
                    nach Ablauf einer Beweissicherungsfrist von 30 Tagen gelöscht.
                </p>
                <p>
                    <strong>Speicherdauer Chatverläufe:</strong> Chatverläufe werden für
                    die Dauer der aktiven Geschäftsanbahnung, längstens 24 Monate nach
                    letzter Kommunikation, gespeichert.
                </p>

                {/* 3. Weitergabe */}
                <h2 id="weitergabe">3. Weitergabe von Daten</h2>
                <p>
                    Eine Übermittlung Ihrer persönlichen Daten an Dritte findet nur statt,
                    wenn:
                </p>
                <ul>
                    <li>
                        Sie Ihre ausdrückliche Einwilligung erteilt haben (Art. 6 Abs. 1
                        lit. a DSGVO),
                    </li>
                    <li>
                        die Verarbeitung für die Vertragsabwicklung erforderlich ist (Art. 6
                        Abs. 1 lit. b DSGVO),
                    </li>
                    <li>
                        eine rechtliche Verpflichtung besteht (Art. 6 Abs. 1 lit. c DSGVO),
                        oder
                    </li>
                    <li>
                        die Weitergabe zur Wahrung berechtigter Interessen erforderlich ist
                        (Art. 6 Abs. 1 lit. f DSGVO).
                    </li>
                </ul>
                <p>
                    Im Falle eines Vertragsabschlusses werden Ihre Daten an die{" "}
                    <strong>SIGNAL IDUNA Allgemeine Versicherung AG</strong>,
                    Joseph-Scherer-Straße 3, 44139 Dortmund, übermittelt. Rechtsgrundlage
                    ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsabwicklung). Die
                    Datenschutzhinweise der SIGNAL IDUNA finden Sie unter{" "}
                    <a
                        href="https://www.signal-iduna.de/datenschutz"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        signal-iduna.de/datenschutz
                    </a>
                    .
                </p>

                {/* 4. Cookies */}
                <h2 id="cookies">4. Cookies</h2>
                <p>
                    Unsere Website verwendet ausschließlich technisch notwendige Cookies,
                    die für den Betrieb der Seite erforderlich sind. Diese richten keinen
                    Schaden an und enthalten keine Viren. Sie dienen dazu, unser Angebot
                    nutzerfreundlicher, effektiver und sicherer zu machen.
                </p>
                <p>
                    Sie können Ihren Browser so einstellen, dass Sie über das Setzen von
                    Cookies informiert werden und Cookies nur im Einzelfall erlauben.
                </p>

                {/* 5. Google Fonts */}
                <h2 id="google-fonts">5. Nutzung von Google Fonts</h2>
                <p>
                    Unsere Website verwendet Google Fonts, einen Dienst der Google Ireland
                    Limited („Google"), Gordon House, Barrow Street, Dublin 4, Irland.
                </p>
                <p>
                    Die Schriftarten werden beim Besuch unserer Website von den Servern
                    von Google geladen, wodurch Google Kenntnis davon erlangt, dass über
                    Ihre IP-Adresse unsere Website aufgerufen wurde.
                </p>
                <p>
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
                    (berechtigtes Interesse an einheitlicher Darstellung der Website).
                </p>
                <p>
                    Weitere Informationen:{" "}
                    <a
                        href="https://developers.google.com/fonts/faq"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        developers.google.com/fonts/faq
                    </a>{" "}
                    und{" "}
                    <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        policies.google.com/privacy
                    </a>
                    .
                </p>

                {/* 6. YouTube */}
                <h2 id="youtube">6. Einbindung von YouTube-Videos</h2>
                <p>
                    Wir haben YouTube-Videos in unser Online-Angebot eingebunden, die auf
                    www.youtube.com gespeichert sind und von unserer Website aus direkt
                    abspielbar sind. Wir nutzen den erweiterten Datenschutzmodus
                    („youtube-nocookie"). Anbieter ist Google Ireland Limited, Gordon
                    House, Barrow Street, Dublin 4, Irland.
                </p>
                <p>
                    Beim Besuch unserer Website erhält YouTube die Information, dass Sie
                    die entsprechende Unterseite aufgerufen haben. Zudem werden die unter
                    Punkt 2 a) genannten Daten übermittelt. Dies erfolgt unabhängig davon,
                    ob YouTube ein Nutzerkonto bereitstellt, über das Sie eingeloggt sind.
                </p>
                <p>
                    Wenn Sie bei Google eingeloggt sind, werden Ihre Daten direkt Ihrem
                    Konto zugeordnet. Wenn Sie die Zuordnung nicht wünschen, müssen Sie
                    sich vorher ausloggen.
                </p>
                <p>
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO.
                </p>
                <p>
                    Weitere Informationen:{" "}
                    <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        policies.google.com/privacy
                    </a>
                    .
                </p>

                {/* 7. Betroffenenrechte */}
                <h2 id="rechte">7. Betroffenenrechte</h2>
                <p>Sie haben das Recht auf:</p>
                <ul>
                    <li>
                        Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten
                        (Art. 15 DSGVO),
                    </li>
                    <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
                    <li>Löschung (Art. 17 DSGVO),</li>
                    <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
                    <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
                    <li>Widerruf einer Einwilligung (Art. 7 Abs. 3 DSGVO),</li>
                    <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO).</li>
                </ul>
                <p>
                    Zur Ausübung Ihrer Rechte genügt eine formlose Mitteilung an die unter
                    Punkt 1 genannten Kontaktdaten.
                </p>

                {/* 8. Widerspruch */}
                <h2 id="widerspruch">8. Widerspruchsrecht</h2>
                <p>
                    Sofern Ihre Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO
                    verarbeitet werden, haben Sie das Recht, gemäß Art. 21 DSGVO
                    Widerspruch einzulegen.
                </p>

                {/* 9. Datensicherheit */}
                <h2 id="datensicherheit">9. Datensicherheit</h2>
                <p>
                    Wir verwenden innerhalb des Website-Besuchs eine SSL-Verschlüsselung
                    (TLS) zum Schutz der Datenübertragung.
                </p>

                {/* 10. Aktualität */}
                <h2 id="aktualitaet">10. Aktualität und Änderung dieser Datenschutzerklärung</h2>
                <p>
                    Diese Datenschutzerklärung ist aktuell gültig und hat den Stand{" "}
                    <strong>Mai 2026</strong>. Durch die Weiterentwicklung unserer
                    Website und Angebote oder aufgrund geänderter gesetzlicher bzw.
                    behördlicher Vorgaben kann es notwendig werden, diese
                    Datenschutzerklärung zu ändern. Die jeweils aktuelle
                    Datenschutzerklärung kann jederzeit auf dieser Seite abgerufen werden.
                </p>

                <hr />

                <p className="text-sm text-neutral-500">
                    Bei Fragen zum Datenschutz erreichen Sie uns unter{" "}
                    <a href="mailto:mike.allmendinger@signal-iduna.net">
                        mike.allmendinger@signal-iduna.net
                    </a>
                    .
                </p>
            </article>
        </main>
    );
}
