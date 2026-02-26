import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const {
            insuranceFor,
            policyHolderSalutation,
            policyHolderName,
            policyHolderBirthDate,
            policyHolderJob,
            policyHolderJobField,
            relationshipToInsured,
            salutation,
            name,
            birthDate,
            job,
            jobField,
            insuranceStartType,
            insuranceStartDate,
            tarif,
            email,
            phone,
            street,
            houseNumber,
            postalCode,
            city,
            iban,
            accountHolder,
            privacyConsent,
            contactConsent,
            riskExclusionConsent
        } = await request.json();

        // Basic validation
        if (!insuranceFor || !name || !email || !birthDate || !job || !phone || !street || !houseNumber || !postalCode || !city || !iban || !accountHolder || !privacyConsent || !contactConsent || !riskExclusionConsent || !insuranceStartType || !tarif) {
            return NextResponse.json(
                { error: 'Alle Felder sind erforderlich' },
                { status: 400 }
            );
        }

        // Additional validation for policy holder if insuring someone else
        if (insuranceFor === 'other') {
            if (!relationshipToInsured || !policyHolderSalutation || !policyHolderName || !policyHolderBirthDate || !policyHolderJob) {
                return NextResponse.json(
                    { error: 'Alle Versicherungsnehmer-Felder sind erforderlich' },
                    { status: 400 }
                );
            }
        }

        // Validate start date if type is date
        if (insuranceStartType === 'date' && !insuranceStartDate) {
            return NextResponse.json(
                { error: 'Bitte gib ein Startdatum an' },
                { status: 400 }
            );
        }

        const brevoApiKey = process.env.BREVO_API_KEY || '';

        // 1. E-Mail an dich (Admin)
        const policyHolderSection = insuranceFor === 'other' ? `
          <p><strong>Beziehung zum Versicherungsnehmer:</strong> ${relationshipToInsured}</p>
          <hr style="margin: 24px 0; border: none; border-top: 2px solid #1a3691;" />
          <h3 style="color: #1a3691;">Versicherungsnehmer (Person, die die Versicherung abschließt):</h3>
          <p><strong>Anrede:</strong> ${policyHolderSalutation}</p>
          <p><strong>Name:</strong> ${policyHolderName}</p>
          <p><strong>Geburtsdatum:</strong> ${policyHolderBirthDate}</p>
          <p><strong>Berufsstand:</strong> ${policyHolderJob}</p>
          ${policyHolderJobField ? `<p><strong>Tätigkeit:</strong> ${policyHolderJobField}</p>` : ''}
          <hr style="margin: 24px 0; border: none; border-top: 2px solid #1a3691;" />
          <h3 style="color: #1a3691;">Versicherte Person:</h3>
        ` : '';

        const insuranceStartSection = insuranceStartType === 'immediate'
          ? 'Sofort'
          : insuranceStartType === 'date' && insuranceStartDate
            ? insuranceStartDate
            : '-';

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
                subject: `Neue Antragsanfrage von ${name}`,
                htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a3691;">Neue Antragsanfrage - PlaySafe - Individuellen Antrag schicken</h2>
          <p><strong>Versicherung für:</strong> ${insuranceFor === 'self' ? 'Sich selbst' : 'Jemand anderen'}</p>
          ${policyHolderSection}
          <p><strong>Anrede:</strong> ${salutation}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Geburtsdatum:</strong> ${birthDate}</p>
          <p><strong>Berufsstand:</strong> ${job}</p>
          ${jobField ? `<p><strong>Tätigkeit:</strong> ${jobField}</p>` : ''}
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
          <h3 style="color: #1a3691;">Kontaktdaten:</h3>
          <p><strong>E-Mail:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <p><strong>Adresse:</strong> ${street} ${houseNumber}, ${postalCode} ${city}</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
          <h3 style="color: #1a3691;">Bankverbindung:</h3>
          <p><strong>IBAN:</strong> ${iban}</p>
          <p><strong>Kontoinhaber:</strong> ${accountHolder}</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
          <h3 style="color: #1a3691;">Versicherungsbeginn & Tarif:</h3>
          <p><strong>Beginn:</strong> ${insuranceStartSection}</p>
          <p><strong>Tarif:</strong> ${tarif}</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
          <h3 style="color: #1a3691;">Einwilligungen:</h3>
          <p><strong>Datenschutz:</strong> ${privacyConsent ? '✓ Akzeptiert' : '✗ Nicht akzeptiert'}</p>
          <p><strong>Kontakterlaubnis:</strong> ${contactConsent ? '✓ Erteilt' : '✗ Nicht erteilt'}</p>
          <p><strong>Risikoausschlüsse bestätigt:</strong> ${riskExclusionConsent ? '✓ Bestätigt (keine Pflegebedürftigkeit, kein Flug-/Motorsport-/Profisportrisiko)' : '✗ Nicht bestätigt'}</p>
        </div>
      `,
            }),
        });

        if (!adminEmailRes.ok) {
            throw new Error(`Brevo Admin-Email Fehler: ${await adminEmailRes.text()}`);
        }

        // 2. Bestätigungsmail an Kunden
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
                subject: 'Dein Antrag ist auf dem Weg',
                htmlContent: `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">

      <h2 style="color: #1a3691;">Vielen Dank für Dein Interesse an einer Sportversicherung!</h2>

      <p><strong>Hallo ${policyHolderName}</strong>,</p>

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
            }),
        });

        if (!customerEmailRes.ok) {
            throw new Error(`Brevo Kunden-Email Fehler: ${await customerEmailRes.text()}`);
        }

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