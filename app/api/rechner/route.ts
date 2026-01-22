import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

// Tarif-Daten basierend auf den offiziellen Dokumenten
const tariffData = {
    Small: {
        price: '10€',
        invaliditaet: '500.000 EUR',
        gipsgeld: '1.000 EUR',
        schwerverletzung: '2.500 EUR',
        krankenhaus: '10 EUR',
        zahnersatz: '20.000 EUR',
    },
    Medium: {
        price: '15€',
        invaliditaet: '750.000 EUR',
        gipsgeld: '1.500 EUR',
        schwerverletzung: '7.000 EUR',
        krankenhaus: '30 EUR',
        zahnersatz: '20.000 EUR',
    },
    Large: {
        price: '20€',
        invaliditaet: '1.000.000 EUR',
        gipsgeld: '2.000 EUR',
        schwerverletzung: '12.000 EUR',
        krankenhaus: '50 EUR',
        zahnersatz: '20.000 EUR',
    },
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
        const { name, email, phone, birthDate, gender, tarif, insuranceFor } = await request.json();

        if (!name || !email || !phone) {
            return NextResponse.json(
                { error: 'Alle Felder sind erforderlich' },
                { status: 400 }
            );
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

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

        // Erstelle den CTA-Link
        const ctaLink = `https://playsafe.fit/angebot?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&birthDate=${encodeURIComponent(birthDate)}&tarif=${encodeURIComponent(tarif)}&gender=${encodeURIComponent(gender)}&insuranceFor=${encodeURIComponent(insuranceFor || 'self')}`;

        // Ersetze alle Platzhalter im Template
        emailTemplate = emailTemplate
            .replace(/{{NAME}}/g, name)
            .replace(/{{TARIFF}}/g, tarif)
            .replace(/{{PRICE}}/g, tariffInfo.price)
            .replace(/{{INVALIDITAET}}/g, tariffInfo.invaliditaet)
            .replace(/{{GIPSGELD}}/g, tariffInfo.gipsgeld)
            .replace(/{{SCHWERVERLETZUNG}}/g, tariffInfo.schwerverletzung)
            .replace(/{{KRANKENHAUS}}/g, tariffInfo.krankenhaus)
            .replace(/{{ZAHNERSATZ}}/g, tariffInfo.zahnersatz)
            .replace(/{{CTA_LINK}}/g, ctaLink);

        // 2. Sende beide E-Mails als Batch (Admin + Kunde)
        const { data: batchData, error: batchError } = await resend.batch.send([
            {
                from: 'PlaySafe <info@mail.playsafe.fit>',
                to: ['korbpatrick@web.de'],
                subject: `Neue Angebotsanfrage von ${name}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                      <h2 style="color: #1a3691;">Neue Angebotsanfrage - Playsafe</h2>
                      <p><strong>Versicherung für:</strong> ${insuranceForLabel}</p>
                      <p><strong>Name (Versicherungsnehmer):</strong> ${name}</p>
                      <p><strong>E-Mail:</strong> ${email}</p>
                      <p><strong>Telefon:</strong> ${phone}</p>
                      <p><strong>Geschlecht (versicherte Person):</strong> ${gender}</p>
                      <p><strong>Geburtsdatum (versicherte Person):</strong> ${birthDate}</p>
                      <p><strong>Tarif:</strong> ${tarif}</p>
                    </div>
                `,
            },
            {
                from: 'PlaySafe <info@mail.playsafe.fit>',
                to: [email],
                subject: 'Ihre persönliche Versicherungsempfehlung - PlaySafe',
                html: emailTemplate,
            },
        ]);

        if (batchError) {
            throw new Error(`Batch-Email Fehler: ${batchError.message}`);
        }

        console.log('Emails erfolgreich gesendet:', batchData);

        // 4. Kontakt in Resend Audience speichern
        const nameParts = name.trim().split(' ');
        const lastName = nameParts[nameParts.length - 1];
        const firstName = nameParts.slice(0, -1).join(' ');

        try {
            await resend.contacts.create({
                email: email,
                firstName: firstName,
                lastName: lastName,
                unsubscribed: false,
            });
            console.log('Kontakt in Resend gespeichert:', email);
        } catch (contactError) {
            // Kontakt existiert möglicherweise bereits - kein kritischer Fehler
            console.log('Kontakt konnte nicht gespeichert werden (existiert evtl. bereits):', contactError);
        }

        return NextResponse.json({
            success: true,
            message: 'Nachricht erfolgreich gesendet',
            emailsSent: batchData
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Server-Fehler beim Senden der E-Mail' },
            { status: 500 }
        );
    }
}