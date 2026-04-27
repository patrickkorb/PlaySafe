import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendConversionAPIEvent, generateEventId } from '@/app/lib/meta-capi';

// Hilfsfunktion um Alter aus Geburtsdatum zu berechnen
function getAgeFromBirthDate(birthDate: string): number | null {
    if (!birthDate || birthDate.length !== 10) return null;

    const parts = birthDate.split('.');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    const birthDateObj = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }

    return age;
}

// Tarif-Daten basierend auf den offiziellen Dokumenten
const tariffData = {
    Small: {
        price: '10,00€',
        invaliditaet: '500.000 EUR',
        gipsgeld: '1.000 EUR',
        schwerverletzung: '2.500 EUR',
        krankenhaus: '10 EUR',
        zahnersatz: '20.000 EUR',
    },
    Medium: {
        price: '15,01€',
        invaliditaet: '750.000 EUR',
        gipsgeld: '1.500 EUR',
        schwerverletzung: '7.000 EUR',
        krankenhaus: '30 EUR',
        zahnersatz: '20.000 EUR',
    },
    Large: {
        price: '20,03€',
        invaliditaet: '1.000.000 EUR',
        gipsgeld: '2.000 EUR',
        schwerverletzung: '12.000 EUR',
        krankenhaus: '50 EUR',
        zahnersatz: '20.000 EUR',
    },
    'Small Kids': {
        price: '12,79€',
        invaliditaet: '500.000 EUR',
        gipsgeld: '1.000 EUR',
        schwerverletzung: '2.500 EUR',
        krankenhaus: '10 EUR',
        zahnersatz: '20.000 EUR',
    },
    'Medium Kids': {
        price: '19,39€',
        invaliditaet: '750.000 EUR',
        gipsgeld: '1.500 EUR',
        schwerverletzung: '7.000 EUR',
        krankenhaus: '30 EUR',
        zahnersatz: '20.000 EUR',
    },
    'Large Kids': {
        price: '26,03€',
        invaliditaet: '1.000.000 EUR',
        gipsgeld: '2.000 EUR',
        schwerverletzung: '12.000 EUR',
        krankenhaus: '50 EUR',
        zahnersatz: '20.000 EUR',
    },
};

// Günstigere Preise für Kinder unter 16 Jahren
const childUnder16Prices: { [key: string]: string } = {
    'Small Kids': '10,42€',
    'Medium Kids': '15,78€',
    'Large Kids': '21,17€',
};

// Mapping für insuranceFor zur Anzeige
const insuranceForLabels: { [key: string]: string } = {
    'self': 'Für sich selbst',
    'child': 'Für Kind',
    'spouse': 'Für Ehepartner/in',
    'partner': 'Für Lebenspartner/in',
};

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, birthDate, gender, tarif, price: clientPrice, insuranceFor, sport, frequency } = await request.json();

        if (!name || !email || !phone) {
            return NextResponse.json(
                { error: 'Alle Felder sind erforderlich' },
                { status: 400 }
            );
        }

        const brevoApiKey = process.env.BREVO_API_KEY || '';

        // Telefonnummer normalisieren: führende 0 → +49, 0049 → +49
        const normalizedPhone = phone
            .replace(/^0049/, '+49')
            .replace(/^0(?!0)/, '+49');

        // Label für insuranceFor
        const insuranceForLabel = insuranceForLabels[insuranceFor] || insuranceFor || 'Nicht angegeben';

        // 1. Lade das detaillierte Email-Template für Kunden
        const templatePath = path.join(process.cwd(), 'emails', 'tariff-details.html');
        let emailTemplate = fs.readFileSync(templatePath, 'utf-8');

        // Hole die Tarif-Daten
        const tariffInfo = tariffData[tarif as keyof typeof tariffData];

        if (!tariffInfo) {
            throw new Error(`Ungültiger Tarif: ${tarif}`);
        }

        // Prüfe ob Kind unter 16 Jahre und passe den Preis an
        let finalPrice = tariffInfo.price;
        if (tarif.includes('Kids') && birthDate) {
            const age = getAgeFromBirthDate(birthDate);
            if (age !== null && age < 16 && childUnder16Prices[tarif]) {
                finalPrice = childUnder16Prices[tarif];
            }
        }

        // Erstelle den CTA-Link
        const ctaLink = `https://playsafe.fit/angebot?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&birthDate=${encodeURIComponent(birthDate)}&tarif=${encodeURIComponent(tarif)}&gender=${encodeURIComponent(gender)}&insuranceFor=${encodeURIComponent(insuranceFor || 'self')}`;

        // Ersetze alle Platzhalter im Template
        emailTemplate = emailTemplate
            .replace(/{{NAME}}/g, name)
            .replace(/{{TARIFF}}/g, tarif)
            .replace(/{{PRICE}}/g, finalPrice)
            .replace(/{{INVALIDITAET}}/g, tariffInfo.invaliditaet)
            .replace(/{{GIPSGELD}}/g, tariffInfo.gipsgeld)
            .replace(/{{SCHWERVERLETZUNG}}/g, tariffInfo.schwerverletzung)
            .replace(/{{KRANKENHAUS}}/g, tariffInfo.krankenhaus)
            .replace(/{{ZAHNERSATZ}}/g, tariffInfo.zahnersatz)
            .replace(/{{CTA_LINK}}/g, ctaLink);

        // 1. Kontakt in Brevo speichern (mit Telefon-Validierung)
        const nameParts = name.trim().split(' ');
        const lastName = nameParts[nameParts.length - 1];
        const firstName = nameParts.slice(0, -1).join(' ');

        const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': brevoApiKey,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                attributes: { FIRSTNAME: firstName, LASTNAME: lastName, SMS: normalizedPhone },
                listIds: [3],
                updateEnabled: true,
            }),
        });

        if (!contactRes.ok) {
            const contactError = await contactRes.json().catch(() => ({}));
            const errorMessage: string = contactError?.message || '';
            if (errorMessage.toLowerCase().includes('sms') || errorMessage.toLowerCase().includes('phone')) {
                return NextResponse.json(
                    { phoneError: 'Ungültige Telefonnummer. Bitte prüfe die Eingabe.' },
                    { status: 400 }
                );
            }
            // Anderer Brevo-Fehler – nicht blockierend, weiter machen
            console.error('Brevo Kontakt-Fehler:', errorMessage);
        }

        // 2. Sende Admin-Mail via Brevo
        const adminEmailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': brevoApiKey,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: 'PlaySafe', email: 'info@playsafe.fit' },
                to: [
                    { email: 'korbpatrick@web.de' },
                    { email: 'mike.allmendinger@signal-iduna.net' },

                ],
                subject: `Neue Angebotsanfrage von ${name}`,
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                      <h2 style="color: #1a3691;">Neue Angebotsanfrage - Playsafe</h2>
                      <p><strong>Versicherung für:</strong> ${insuranceForLabel}</p>
                      <p><strong>Name (Versicherungsnehmer):</strong> ${name}</p>
                      <p><strong>E-Mail:</strong> ${email}</p>
                      <p><strong>Telefon:</strong> ${phone}</p>
                      <p><strong>Geschlecht (versicherte Person):</strong> ${gender}</p>
                      <p><strong>Geburtsdatum (versicherte Person):</strong> ${birthDate}</p>
                      <p><strong>Sport:</strong> ${sport || 'Nicht angegeben'}</p>
                      <p><strong>Häufigkeit:</strong> ${frequency || 'Nicht angegeben'}</p>
                      <p><strong>Tarif:</strong> ${tarif}</p>
                      <p><strong>Angezeigter Preis:</strong> ${clientPrice || finalPrice}</p>
                    </div>
                `,
            }),
        });

        if (!adminEmailRes.ok) {
            throw new Error(`Brevo Admin-Email Fehler: ${await adminEmailRes.text()}`);
        }

        // 3. Sende Kunden-Mail via Brevo
        const customerEmailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': brevoApiKey,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: 'PlaySafe', email: 'info@playsafe.fit' },
                to: [{ email: email }],
                subject: 'Ihre persönliche Versicherungsempfehlung - PlaySafe',
                htmlContent: emailTemplate,
            }),
        });

        if (!customerEmailRes.ok) {
            console.error(`Brevo Kunden-Email Fehler: ${await customerEmailRes.text()}`);
        }

        console.log('Emails erfolgreich gesendet via Brevo');

        //4. Lead im LeadTool speichern


        const response = await fetch('https://leadtool.vercel.app/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.LEADTOOL_API_KEY || '',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                telefon: phone,
                quelle: 'PlaySafe.fit',
                notiz: sport + " für " + insuranceFor + " Tarif:" + tarif,
            }),
        });

        if (!response.ok) {
            console.error('LeadTool Fehler:', await response.text());
            // Kein Return hier - Lead-Fehler soll den Rest nicht blockieren
        }

        // 5. n8n Webhook (fire-and-forget)
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
        if (n8nWebhookUrl) {
            fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source: 'rechner',
                    timestamp: new Date().toISOString(),
                    name,
                    firstName,
                    lastName,
                    email,
                    phone: normalizedPhone,
                    tarif,
                    price: finalPrice,
                    invaliditaet: tariffInfo.invaliditaet,
                    gipsgeld: tariffInfo.gipsgeld,
                    schwerverletzung: tariffInfo.schwerverletzung,
                    krankenhaus: tariffInfo.krankenhaus,
                    zahnersatz: tariffInfo.zahnersatz,
                    insuranceFor: insuranceFor || 'self',
                    insuranceForLabel,
                    birthDate,
                    gender,
                    sport: sport || null,
                    frequency: frequency || null,
                    ctaLink,
                }),
            }).catch((err) => console.error('n8n Webhook Fehler:', err));
        }

        // 6. Meta Conversion API Lead Event (server-seitig, zuverlässig)
        const leadEventId = generateEventId();
        const nameParts2 = name.trim().split(' ');
        const leadValue = parseInt(finalPrice) || 10;
        try {
            await sendConversionAPIEvent(
                {
                    eventName: 'Lead',
                    eventId: leadEventId,
                    eventSourceUrl: 'https://playsafe.fit/rechner',
                    actionSource: 'website',
                    userData: {
                        email,
                        phone,
                        firstName: nameParts2.slice(0, -1).join(' ') || nameParts2[0],
                        lastName: nameParts2[nameParts2.length - 1],
                    },
                    customData: {
                        currency: 'EUR',
                        value: leadValue,
                    },
                },
                request
            );
        } catch (metaError) {
            console.error('Meta CAPI Lead Fehler:', metaError);
        }

        return NextResponse.json({
            success: true,
            message: 'Nachricht erfolgreich gesendet',
            leadEventId,
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Server-Fehler beim Senden der E-Mail' },
            { status: 500 }
        );
    }


}