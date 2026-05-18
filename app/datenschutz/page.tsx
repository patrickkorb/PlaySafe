import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Datenschutzerklärung | PlaySafe",
    description:
        "Informationen zum Datenschutz bei PlaySafe – wie wir personenbezogene Daten verarbeiten, insbesondere bei Nutzung des Versicherungsrechners und der WhatsApp-Kommunikation.",
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
    { id: "weitergabe", label: "Weitergabe von Daten" },
    { id: "cookies", label: "Cookies und lokaler Speicher" },
    { id: "meta-pixel", label: "Meta Pixel & Conversion API" },
    { id: "google-fonts", label: "Google Fonts" },
    { id: "youtube", label: "YouTube-Videos" },
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
];

export default function DatenschutzPage() {
    return (
        <main>
            <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Datenschutzerklärung</h1>
                    <p className="text-sm text-gray-400">Stand: Mai 2026</p>
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

                        <SubSection id="whatsapp" title="e) Kommunikation per WhatsApp">
                            <p>
                                Nach Ihrer Einwilligung kontaktieren wir Sie auf der angegebenen Telefonnummer
                                per WhatsApp, um Ihr Angebot zu besprechen.
                            </p>
                            <InfoBox label="Zweck">Angebotsbesprechung und Terminvereinbarung</InfoBox>
                            <InfoBox label="Rechtsgrundlage">Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</InfoBox>
                            <InfoBox label="Verarbeitete Daten">Name, Telefonnummer (WhatsApp-ID), Nachrichteninhalte</InfoBox>
                            <div className="text-sm space-y-2 mt-2">
                                <p className="font-semibold text-gray-800">Empfänger:</p>
                                <div className="border border-gray-200 rounded-lg px-4 py-3">
                                    <p className="font-medium text-gray-900">Meta Platforms Ireland Ltd.</p>
                                    <p className="text-gray-600 text-xs mt-0.5">WhatsApp Business Platform · Merrion Road, Dublin 4 · Datenübertragung in die USA möglich (EU-US Data Privacy Framework, Art. 45 DSGVO)</p>
                                </div>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 mt-2">
                                <span className="font-semibold">Widerruf:</span> Antworten Sie auf WhatsApp mit „Stopp" oder schreiben Sie an{" "}
                                <a href="mailto:mike.allmendinger@signal-iduna.net" className="underline">mike.allmendinger@signal-iduna.net</a>.
                                Ihre Daten werden nach 30 Tagen gelöscht.
                            </div>
                        </SubSection>
                    </Section>

                    {/* 3 */}
                    <Section id="weitergabe" number="3" title="Weitergabe von Daten">
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
                    <Section id="cookies" number="4" title="Cookies und lokaler Speicher">
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
                                    desc: "Nur nach ausdrücklicher Einwilligung aktiv. Siehe Abschnitt 5.",
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
                    </Section>

                    {/* 5 */}
                    <Section id="meta-pixel" number="5" title="Meta Pixel und Meta Conversion API">
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
                                ausschließlich wenn Sie durch Absenden eines Formulars Ihre Einwilligung erteilt haben.
                            </p>
                            <InfoBox label="Übermittelte Daten">
                                Gehashte E-Mail &amp; Telefonnummer (SHA-256), IP-Adresse, Event-Typ (z. B. „Lead")
                            </InfoBox>
                            <InfoBox label="Zweck">Messung und Optimierung unserer Werbekampagnen auf Facebook und Instagram</InfoBox>
                            <InfoBox label="Rechtsgrundlage">Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</InfoBox>
                            <InfoBox label="Empfänger">
                                Meta Platforms Ireland Ltd., Merrion Road, Dublin 4 – Datenübertragung in USA möglich (EU-US Data Privacy Framework, Art. 45 DSGVO)
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

                    {/* 6 */}
                    <Section id="google-fonts" number="6" title="Nutzung von Google Fonts">
                        <p>
                            Unsere Website verwendet Google Fonts (Google Ireland Limited, Gordon House, Barrow Street,
                            Dublin 4). Die Schriftarten werden von Google-Servern geladen, wodurch Google Kenntnis von
                            Ihrer IP-Adresse erlangt.
                        </p>
                        <InfoBox label="Rechtsgrundlage">Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einheitlicher Darstellung)</InfoBox>
                        <p className="text-sm">
                            Mehr Infos:{" "}
                            <a href="https://developers.google.com/fonts/faq" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                Google Fonts FAQ
                            </a>{" "}
                            &middot;{" "}
                            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                Google Datenschutz
                            </a>
                        </p>
                    </Section>

                    {/* 7 */}
                    <Section id="youtube" number="7" title="Einbindung von YouTube-Videos">
                        <p>
                            Wir binden YouTube-Videos im erweiterten Datenschutzmodus („youtube-nocookie") ein.
                            Anbieter ist Google Ireland Limited, Dublin 4. YouTube erhält beim Besuch Ihrer Unterseite
                            Ihre IP-Adresse. Wenn Sie bei Google eingeloggt sind, werden Daten Ihrem Konto zugeordnet.
                        </p>
                        <InfoBox label="Rechtsgrundlage">Art. 6 Abs. 1 lit. f DSGVO</InfoBox>
                        <p className="text-sm">
                            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                Google Datenschutzrichtlinie →
                            </a>
                        </p>
                    </Section>

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
                            Diese Datenschutzerklärung hat den Stand <strong>Mai 2026</strong>. Wir behalten uns
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
