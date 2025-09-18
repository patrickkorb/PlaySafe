import Link from "next/link";


export default function Impressum() {
    return (
        <section className={"lg:max-w-5xl mx-auto my-16"}>
            {/*<h1 className={"text-6xl font-bold"}>PlaySafe</h1>*/}
            <h2 className={"text-6xl font-bold py-12"}>Impressum</h2>
            <div className="prose max-w-none text-gray-700">
                <p>
                    <strong>Verantwortlicher nach § 5 TMG:</strong><br />
                    Mike Allmendinger<br />
                    Generalagentur der SIGNAL IDUNA<br />
                    Friedrichsplatz 6<br />
                    76133 Karlsruhe<br />
                    <br />
                    Telefon: 0721 / 981010<br />
                    E-Mail: <a href="mailto:mike.allmendinger@signal-iduna.net" className="text-primary hover:underline">mike.allmendinger@signal-iduna.net</a>
                </p>


                <p>
                    <strong>Berufsbezeichnung:</strong><br />
                    Gebundener Versicherungsvertreter nach § 34d Abs. 4 GewO, Bundesrepublik Deutschland
                </p>
                <p>
                    Registrierungsnummer: D-K8W7-3CABE-20<br />
                    Zuständige Registerstelle:<br />
                    Deutscher Industrie- und Handelskammertag (DIHK) e.V.<br />
                    Breite Straße 29<br />
                    10178 Berlin<br />
                    Telefon: 0180 600 585 50 (Festnetzpreis 0,20 €/Anruf; Mobilfunkpreise max. 0,60 €/Anruf)<br />
                    Internet: <a href="https://www.vermittlerregister.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.vermittlerregister.info</a>
                </p>


                <p>
                    <strong>Zuständige Aufsichtsbehörde:</strong><br />
                    Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)<br />
                    Marie-Curie-Straße 24–28, 60439 Frankfurt<br />
                    Graurheindorfer Straße 108, 53117 Bonn
                </p>


                <p>
                    Keine Umsatzsteuer-Identifikationsnummer vorhanden
                </p>


                <p>
                    <strong>Berufsrechtliche Regelungen:</strong><br />
                    § 34d GewO<br />
                    §§ 59–68 VVG<br />
                    VersVermV<br />
                    <br />
                    Die berufsrechtlichen Regelungen können über die vom Bundesministerium der Justiz und der juris GmbH betriebene Homepage <a href="https://www.gesetze-im-internet.de" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.gesetze-im-internet.de</a> eingesehen und abgerufen werden.
                </p>


                <p>
                    <strong>Schlichtungsstellen für außergerichtliche Streitbeilegung:</strong><br />
                    <br />
                    Versicherungsombudsmann e.V.<br />
                    Postfach 08 06 32<br />
                    10006 Berlin<br />
                    Telefon: 0800 3696000<br />
                    Fax: 0800 3699000<br />
                    Internet: <Link href="https://www.versicherungsombudsmann.de" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.versicherungsombudsmann.de</Link>
                </p>

                <p>
                    Ombudsmann Private Kranken- und Pflegeversicherung<br />
                    Postfach 060222<br />
                    10052 Berlin<br />
                    Telefon: 0800 2550444<br />
                    Fax: 030 20458931<br />
                    Internet: <a href="https://www.pkv-ombudsmann.de" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.pkv-ombudsmann.de</a>
                </p>
            </div>

        </section>
    )
}