import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, phone } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
          { error: 'Alle Felder sind erforderlich' },
          { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.web.de',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 1. E-Mail an dich
    await transporter.sendMail({
      from: `"PlaySafe Anfrage" <${process.env.EMAIL_USER}>`,
      to: 'mike.allmendinger@signal-iduna.net',
      subject: `Neue Kontaktanfrage von ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a3691;">Neue Kontaktanfrage - PlaySafe</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>E-Mail:</strong> ${email}</p>
          ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
          <p><strong>Nachricht:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    // 2. Canva-Template laden und anpassen
    const templatePath = path.join(process.cwd(), 'emails', 'email.html');
    let emailTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Platzhalter ersetzen
    emailTemplate = emailTemplate
        .replace(/{{NAME}}/g, name)

    // Bestätigungsmail mit Template an Kunden
    await transporter.sendMail({
      from: `"PlaySafe" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Vielen Dank für Ihre Nachricht - PlaySafe',
      html: emailTemplate,
    });

    return NextResponse.json({
      success: true,
      message: 'Nachricht erfolgreich gesendet'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
        { error: 'Server-Fehler beim Senden der E-Mail' },
        { status: 500 }
    );
  }
}