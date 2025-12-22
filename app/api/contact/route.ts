import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, phone } = await request.json();

    if (!name || !email || !message || !phone) {
      return NextResponse.json(
          { error: 'Alle Felder sind erforderlich' },
          { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // 1. E-Mail an dich (Admin)
    const adminEmail = await resend.emails.send({
      from: 'PlaySafe <info@mail.playsafe.fit>',
      to: 'korbpatrick@web.de',
      subject: `Neue Kontaktanfrage von ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a3691;">Neue Kontaktanfrage - PlaySafe</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>E-Mail:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone}</p>
          <p><strong>Nachricht:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    console.log('Admin-E-Mail gesendet:', adminEmail);

    // 2. Bestätigungsmail an Kunden
    const templatePath = path.join(process.cwd(), 'emails', 'email.html');
    let emailTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Platzhalter ersetzen
    emailTemplate = emailTemplate.replace(/{{NAME}}/g, name);

    const customerEmail = await resend.emails.send({
      from: 'PlaySafe <info@mail.playsafe.fit>',
      to: email,
      subject: 'Vielen Dank für Ihre Nachricht - PlaySafe',
      html: emailTemplate,
    });

    console.log('Bestätigungsmail gesendet:', customerEmail);

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