import { NextRequest, NextResponse } from 'next/server';
import { sendConversionAPIEvent, generateEventId } from '@/app/lib/meta-capi';

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

const tariffData = {
    Small: { price: '10,00€', invaliditaet: '500.000 EUR', gipsgeld: '1.000 EUR', schwerverletzung: '2.500 EUR', krankenhaus: '10 EUR', zahnersatz: '20.000 EUR' },
    Medium: { price: '15,01€', invaliditaet: '750.000 EUR', gipsgeld: '1.500 EUR', schwerverletzung: '7.000 EUR', krankenhaus: '30 EUR', zahnersatz: '20.000 EUR' },
    Large: { price: '20,03€', invaliditaet: '1.000.000 EUR', gipsgeld: '2.000 EUR', schwerverletzung: '12.000 EUR', krankenhaus: '50 EUR', zahnersatz: '20.000 EUR' },
    'Small Kids': { price: '12,79€', invaliditaet: '500.000 EUR', gipsgeld: '1.000 EUR', schwerverletzung: '2.500 EUR', krankenhaus: '10 EUR', zahnersatz: '20.000 EUR' },
    'Medium Kids': { price: '19,39€', invaliditaet: '750.000 EUR', gipsgeld: '1.500 EUR', schwerverletzung: '7.000 EUR', krankenhaus: '30 EUR', zahnersatz: '20.000 EUR' },
    'Large Kids': { price: '26,03€', invaliditaet: '1.000.000 EUR', gipsgeld: '2.000 EUR', schwerverletzung: '12.000 EUR', krankenhaus: '50 EUR', zahnersatz: '20.000 EUR' },
};

const childUnder16Prices: { [key: string]: string } = {
    'Small Kids': '10,42€',
    'Medium Kids': '15,78€',
    'Large Kids': '21,17€',
};

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

        const normalizedPhone = phone
            .replace(/^0049/, '+49')
            .replace(/^0(?!0)/, '+49');

        const insuranceForLabel = insuranceForLabels[insuranceFor] || insuranceFor || 'Nicht angegeben';

        const tariffInfo = tariffData[tarif as keyof typeof tariffData];
        if (!tariffInfo) {
            throw new Error(`Ungültiger Tarif: ${tarif}`);
        }

        let finalPrice = tariffInfo.price;
        if (tarif.includes('Kids') && birthDate) {
            const age = getAgeFromBirthDate(birthDate);
            if (age !== null && age < 16 && childUnder16Prices[tarif]) {
                finalPrice = childUnder16Prices[tarif];
            }
        }

        const nameParts = name.trim().split(' ');
        const lastName = nameParts[nameParts.length - 1];
        const firstName = nameParts.slice(0, -1).join(' ');

        const ctaLink = `https://playsafe.fit/angebot?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&birthDate=${encodeURIComponent(birthDate)}&tarif=${encodeURIComponent(tarif)}&gender=${encodeURIComponent(gender)}&insuranceFor=${encodeURIComponent(insuranceFor || 'self')}`;

        // n8n Webhook — übernimmt Emails, Kontakt-Speicherung etc.
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
        if (n8nWebhookUrl) {
            const waId = normalizedPhone.replace(/^\+49/, '0');

            // Geburtsdatum sicherstellen: DD.MM.YYYY
            const geburtsdatum: string | null = (birthDate && /^\d{2}\.\d{2}\.\d{4}$/.test(birthDate))
                ? birthDate
                : null;

            // Gender auf Deutsch normalisieren
            const geschlechtMap: Record<string, string> = {
                'Männlich': 'Männlich',
                'männlich': 'Männlich',
                'male': 'Männlich',
                'Weiblich': 'Weiblich',
                'weiblich': 'Weiblich',
                'female': 'Weiblich',
            };
            const geschlecht = geschlechtMap[gender] ?? 'Nicht angegeben';

            const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
                ?? request.headers.get('x-real-ip')
                ?? null;

            fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vorname: firstName,
                    nachname: lastName || null,
                    geburtsdatum,
                    email,
                    telefonnummer: normalizedPhone,
                    wa_id: waId,
                    geschlecht,
                    infos: {
                        sportart: sport || null,
                        haeufigkeit: frequency || null,
                        versicherung_fuer: insuranceForLabel,
                        tarif,
                        monatsbeitrag: finalPrice,
                        leistungen: {
                            invaliditaet: tariffInfo.invaliditaet,
                            gipsgeld: tariffInfo.gipsgeld,
                            schwerverletzung: tariffInfo.schwerverletzung,
                            krankenhaus_tagegeld: tariffInfo.krankenhaus,
                            zahnersatz: tariffInfo.zahnersatz,
                        },
                    },
                    status: 'new',
                    lead_source: 'playsafe.fit',
                    opt_in_text: 'Ich stimme der Datenschutzerklärung zu und bin damit einverstanden, dass PlaySafe mich per E-Mail, WhatsApp und Telefon zu meinem Versicherungsangebot kontaktieren darf.',
                    opt_in_ip: clientIp,
                    opt_in_source_url: 'https://playsafe.fit/rechner',
                    data_processing_consent_version: null,
                    cta_link: ctaLink,
                }),
            }).catch((err) => console.error('n8n Webhook Fehler:', err));
        }

        // Meta Conversion API
        const leadEventId = generateEventId();
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
                        firstName: nameParts.slice(0, -1).join(' ') || nameParts[0],
                        lastName: nameParts[nameParts.length - 1],
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
