import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, phone } = await request.json();

    if (!name || !email || !message || !phone) {
      return NextResponse.json(
          { error: 'Alle Felder sind erforderlich' },
          { status: 400 }
      );
    }

    const brevoApiKey = process.env.BREVO_API_KEY || '';

    // 1. E-Mail an dich (Admin)
    const adminEmailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'PlaySafe', email: 'info@playsafe.fit' },
        to: [{ email: 'korbpatrick@web.de' }],
        subject: `Neue Kontaktanfrage von ${name}`,
        htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a3691;">Neue Kontaktanfrage - PlaySafe</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>E-Mail:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <p><strong>Nachricht:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
      }),
    });

    if (!adminEmailRes.ok) {
      throw new Error(`Brevo Admin-Email Fehler: ${await adminEmailRes.text()}`);
    }

    // 2. Bestätigungsmail an Kunden
    const templatePath = path.join(process.cwd(), 'emails', 'email.html');
    let emailTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Platzhalter ersetzen
    emailTemplate = emailTemplate.replace(/{{NAME}}/g, name);

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
        subject: 'Vielen Dank für Ihre Nachricht - PlaySafe',
        htmlContent: emailTemplate,
      }),
    });

    if (!customerEmailRes.ok) {
      throw new Error(`Brevo Kunden-Email Fehler: ${await customerEmailRes.text()}`);
    }

    console.log('Bestätigungsmail gesendet via Brevo');

    // 3. Kontakt in Brevo Liste 3 speichern
    const nameParts = name.trim().split(' ');
    const lastName = nameParts[nameParts.length - 1];
    const firstName = nameParts.slice(0, -1).join(' ');

    try {
      const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          attributes: { FIRSTNAME: firstName, LASTNAME: lastName },
          listIds: [3],
          updateEnabled: true,
        }),
      });
      if (contactRes.ok) {
        console.log('Kontakt in Brevo gespeichert:', email);
      } else {
        console.log('Brevo Kontakt-Fehler:', await contactRes.text());
      }
    } catch (contactError) {
      console.log('Kontakt konnte nicht gespeichert werden:', contactError);
    }

    return NextResponse.json({
      success: true,
      message: 'Nachricht erfolgreich gesendet',
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
        { error: 'Server-Fehler beim Senden der E-Mail' },
        { status: 500 }
    );
  }
}