import { NextRequest, NextResponse } from 'next/server';

// Preise in € pro Monat
const TARIFF_PRICES: Record<string, number> = {
  'Small': 10.00,
  'Medium': 15.01,
  'Large': 20.03,
};
const CHILD_PRICES_OVER16: Record<string, number> = {
  'Small Kids': 12.79,
  'Medium Kids': 19.39,
  'Large Kids': 26.03,
};
const CHILD_PRICES_UNDER16: Record<string, number> = {
  'Small Kids': 10.42,
  'Medium Kids': 15.78,
  'Large Kids': 21.17,
};

function getAgeFromBirthDate(birthDate: string): number {
  const [day, month, year] = birthDate.split('.').map(Number);
  const birth = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) age--;
  return age;
}

function getTarifPrice(tarifTitle: string, birthDate: string): number | null {
  if (TARIFF_PRICES[tarifTitle] !== undefined) return TARIFF_PRICES[tarifTitle];
  if (CHILD_PRICES_OVER16[tarifTitle] !== undefined) {
    const age = getAgeFromBirthDate(birthDate);
    return age >= 16 ? CHILD_PRICES_OVER16[tarifTitle] : CHILD_PRICES_UNDER16[tarifTitle];
  }
  return null;
}

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
            riskExclusionConsent,
            discount,
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

        // Preisberechnung
        const insuredBirthDate = birthDate || policyHolderBirthDate || '';
        const originalPrice = getTarifPrice(tarif, insuredBirthDate);
        const discountAmount = (discount && originalPrice) ? Math.round(originalPrice * discount) / 100 : 0;
        const finalPrice = originalPrice !== null ? originalPrice - discountAmount : null;

        const formatPrice = (p: number) =>
          p.toFixed(2).replace('.', ',') + '€';

        const discountSection = (discount && discount > 0 && originalPrice !== null)
          ? `
          <hr style="margin: 24px 0; border: none; border-top: 3px solid #f97316;" />
          <div style="background: #fff7ed; border: 2px solid #f97316; border-radius: 12px; padding: 20px; margin: 16px 0;">
            <h3 style="color: #f97316; margin: 0 0 12px 0; font-size: 18px;">🎁 Rabatt aktiviert!</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #555;">Normaler Monatsbeitrag:</td>
                <td style="padding: 6px 0; text-align: right; color: #555;">${formatPrice(originalPrice)}/Monat</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #f97316;">Rabatt (${discount}%):</td>
                <td style="padding: 6px 0; text-align: right; color: #f97316;">− ${formatPrice(discountAmount)}/Monat</td>
              </tr>
              <tr style="border-top: 1px solid #f97316;">
                <td style="padding: 10px 0 6px; font-weight: bold; font-size: 16px; color: #1a3691;">Finaler Monatsbeitrag:</td>
                <td style="padding: 10px 0 6px; text-align: right; font-weight: bold; font-size: 20px; color: #16a34a;">${formatPrice(finalPrice!)}/Monat</td>
              </tr>
            </table>
          </div>
          <hr style="margin: 24px 0; border: none; border-top: 3px solid #f97316;" />
          `
          : '';

        const brevoApiKey = process.env.BREVO_API_KEY || '';

        // 1. Vollständige E-Mail an Mike (mit allen Kundendaten)
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

        // E-Mail an Mike (vollständige Kundendaten)
        const mikeEmailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': brevoApiKey,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: 'PlaySafe', email: 'info@playsafe.fit' },
                to: [{ email: 'mike.allmendinger@signal-iduna.net' }],
                subject: discount && discount > 0 ? `🎁 Neue Antragsanfrage von ${name} (${discount}% Rabatt)` : `Neue Antragsanfrage von ${name}`,
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
          ${discountSection}
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
          <h3 style="color: #1a3691;">Einwilligungen:</h3>
          <p><strong>Datenschutz:</strong> ${privacyConsent ? '✓ Akzeptiert' : '✗ Nicht akzeptiert'}</p>
          <p><strong>Kontakterlaubnis:</strong> ${contactConsent ? '✓ Erteilt' : '✗ Nicht erteilt'}</p>
          <p><strong>Risikoausschlüsse bestätigt:</strong> ${riskExclusionConsent ? '✓ Bestätigt (keine Pflegebedürftigkeit, kein Flug-/Motorsport-/Profisportrisiko)' : '✗ Nicht bestätigt'}</p>
        </div>
      `,
            }),
        });

        if (!mikeEmailRes.ok) {
            throw new Error(`Brevo Mike-Email Fehler: ${await mikeEmailRes.text()}`);
        }

        // E-Mail an Patrick (nur Benachrichtigung, keine Kundendaten)
        const notifyEmailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': brevoApiKey,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: 'PlaySafe', email: 'info@playsafe.fit' },
                to: [{ email: 'korbpatrick@web.de' }],
                subject: discount && discount > 0 ? `🎁 Neuer Antrag eingegangen (${discount}% Rabatt)` : `Neuer Antrag eingegangen`,
                htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a3691;">Neuer Antrag eingegangen</h2>
          <p><strong>Tarif:</strong> ${tarif}</p>
          <p><strong>Versicherungsbeginn:</strong> ${insuranceStartSection}</p>
          ${discountSection}
          <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
            Die vollständigen Kundendaten wurden an Mike weitergeleitet.
          </p>
        </div>
      `,
            }),
        });

        if (!notifyEmailRes.ok) {
            throw new Error(`Brevo Notify-Email Fehler: ${await notifyEmailRes.text()}`);
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