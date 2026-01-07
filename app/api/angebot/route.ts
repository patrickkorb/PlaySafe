import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
    try {
        const { salutation, name, birthDate, email, phone, street, houseNumber, postalCode, city, iban, accountHolder, privacyConsent, contactConsent } = await request.json();

        if (!name || !email || !birthDate || !phone || !street || !houseNumber || !postalCode || !city || !iban || !accountHolder || !privacyConsent || !contactConsent) {
            return NextResponse.json(
                { error: 'Alle Felder sind erforderlich' },
                { status: 400 }
            );
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        // 1. E-Mail an dich (Admin)
        const adminEmail = await resend.emails.send({
            from: 'PlaySafe <info@mail.playsafe.fit>',
            to: ['korbpatrick@web.de'],
            subject: `Neue Antragsanfrage von ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a3691;">Neue Antragsanfrage - PlaySafe - Individuellen Antrag schicken</h2>
          <p><strong>Anrede:</strong> ${salutation}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>E-Mail:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <p><strong>Geburtsdatum:</strong> ${birthDate}</p>
          <p><strong>Adresse:</strong> ${street} ${houseNumber}, ${postalCode} ${city}</p>
          <p><strong>IBAN:</strong> ${iban}</p>
          <p><strong>Kontoinhaber:</strong> ${accountHolder}</p>
          <p><strong>Datenschutz und -Kontaktzustimmung:</strong> ${privacyConsent}, ${contactConsent}</p>
        </div>
      `,
        });

        // 2. Bestätigungsmail an Kunden
        const customerEmail = await resend.emails.send({
            from: 'PlaySafe <info@mail.playsafe.fit>',
            to: email,
            subject: 'Dein Antrag ist auf dem Weg',
            html: `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      
      <h2 style="color: #1a3691;">Vielen Dank für Dein Interesse an einer Sportversicherung!</h2>

      <p>Hallo ${name},</p>

      <p>
        wir bestätigen dir hiermit, dass wir deine Angaben erfolgreich und sicher erhalten haben.
        Deine Daten werden selbstverständlich vertraulich behandelt und ausschließlich zur
        Erstellung deines Antrags verwendet.
      </p>

      <p>
        Aktuell prüfen wir deine Angaben sorgfältig und erstellen auf dieser Basis deinen
        individuellen Antrag. In der Regel erhältst du diesen
        <strong>innerhalb von 24 Stunden</strong> per E-Mail.
      </p>

      <p>
        Sollten während der Prüfung Rückfragen entstehen, melden wir uns direkt bei dir.
      </p>

      <p>
        Bei Fragen kannst du uns auch jederzeit gerne kontaktieren.
      </p>

      <p style="margin-top: 32px;">
        Viele Grüße<br>
        <strong>Dein PlaySafe Team</strong>
      </p>

      <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #777;">
        Hinweis: Diese E-Mail dient lediglich zur Bestätigung des Eingangs deiner Daten.
        Bitte antworte nicht auf diese Nachricht.
      </p>

    </div>
  `,
        });

        return NextResponse.json({
            success: true,
            message: 'Nachricht erfolgreich gesendet',
            emailsSent: {
                admin: adminEmail.data?.id,
                customer: customerEmail.data?.id
            }
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Server-Fehler beim Senden der E-Mail' },
            { status: 500 }
        );
    }
}