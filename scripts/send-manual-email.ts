import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendManualEmail() {
    const recipientEmail = 't.duarte222@googlemail.com';
    const recipientName = 'Marlon Tomas Duarte';

    // Lade das HTML-Template
    const templatePath = path.join(__dirname, '../emails/tariff-details.html');
    let htmlContent = fs.readFileSync(templatePath, 'utf-8');

    // Ersetze alle Platzhalter für den Large Tarif
    htmlContent = htmlContent
        .replace('{{NAME}}', recipientName)
        .replace('{{TARIFF}}', 'Large')
        .replace('{{PRICE}}', '20 EUR')
        .replace('{{INVALIDITAET}}', '1.000.000 EUR')
        .replace('{{GIPSGELD}}', '2.000 EUR')
        .replace('{{SCHWERVERLETZUNG}}', '12.000 EUR')
        .replace('{{KRANKENHAUS}}', '50 EUR')
        .replace('{{ZAHNERSATZ}}', '20.000 EUR')
        .replace('{{CTA_LINK}}', 'https://playsafe.fit/angebot');

    try {
        const result = await resend.emails.send({
            from: 'PlaySafe <info@mail.playsafe.fit>',
            to: recipientEmail,
            subject: 'Dein PlaySafe Angebot & Terminbestätigung',
            html: htmlContent,
        });

        console.log('E-Mail erfolgreich gesendet!');
        console.log('E-Mail ID:', result.data?.id);
        console.log('Empfänger:', recipientEmail);
    } catch (error) {
        console.error('Fehler beim Senden der E-Mail:', error);
    }
}

sendManualEmail();
