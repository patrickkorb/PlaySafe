import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, birthDate, gender, tarif } = await request.json();

        if (!name || !email || !phone) {
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
            subject: `Neue Angebotsanfrage von ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a3691;">Neue Angebotsanfrage - Playsafe - Max Mustermann Angebot schicken</h2>
          <p><strong>Name:</strong>${gender} ${name}</p>
          <p><strong>E-Mail:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <p><strong>Geburtsdatum:</strong> ${birthDate}</p>
          <p><strong>Tarif:</strong> ${tarif}</p>
        </div>
      `,
        });

        const tariffPdfMap: Record<string, string> = {
            Small: 'playsafe-small.pdf',
            Medium: 'playsafe-medium.pdf',
            Large: 'playsafe-large.pdf',
        };

        const pdfFileName = tariffPdfMap[tarif];
        console.log('pdfFileName:', tarif);

        const pdfPath = path.join(process.cwd(), 'emails', 'pdfs', pdfFileName);
        const pdfBuffer = fs.readFileSync(pdfPath);
        const pdfBase64 = pdfBuffer.toString('base64');

        const customerEmail = await resend.emails.send({
            from: 'PlaySafe <info@mail.playsafe.fit>',
            to: email,
            subject: 'Dein persönliches PlaySafe-Angebot',
            html: `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      
      <h2 style="color: #1a3691;">Dein persönliches PlaySafe-Angebot</h2>

      <p>Hallo ${name},</p>

      <p>
        auf Basis deiner Angaben haben wir dein individuelles PlaySafe-Angebot berechnet.
        Das passende Angebot für den <strong>${tarif.toUpperCase()}-Tarif</strong> findest du im Anhang dieser E-Mail.
      </p>

      <p>
        Nimm dir gerne die Zeit, das Angebot in Ruhe durchzulesen.
        Wenn dir die Versicherung zusagt, kannst du im nächsten Schritt
        deine Daten für den Antrag bequem online ausfüllen.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a
          href="https://playsafe.fit/angebot?name=${name}&email=${email}&phone=${phone}&birthDate=${birthDate}&tarif=${tarif}&gender=${gender}"
          style="
            background-color: #1a3691;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
          "
        >
          Jetzt Antrag ausfüllen
        </a>
      </div>

      <p>
        Solltest du vorab Fragen haben oder dir unsicher sein,
        melde dich gerne jederzeit bei uns – wir helfen dir weiter.
      </p>

      <p style="margin-top: 32px;">
        Viele Grüße<br>
        <strong>Dein PlaySafe Team</strong>
      </p>

      <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #777;">
        Hinweis: Dieses Angebot ist unverbindlich und stellt noch keinen Antrag dar.
      </p>

    </div>
  `,
            attachments: [
                {
                    filename: 'PlaySafe-Angebot.pdf',
                    content: pdfBase64,
                },
            ],
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