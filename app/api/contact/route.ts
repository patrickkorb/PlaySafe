import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, phone } = await request.json();

    console.log('Received data:', { name, email, message, phone });

    if (!name || !email || !message) {
      console.log('Validation failed:', { name: !!name, email: !!email, message: !!message });
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' }, 
        { status: 400 }
      );
    }

    // Nodemailer Transporter für web.de
    const transporter = nodemailer.createTransport({
      host: 'smtp.web.de',
      port: 587,
      secure: false, // true für 465, false für andere ports
      auth: {
        user: process.env.EMAIL_USER, // deine web.de E-Mail
        pass: process.env.EMAIL_PASS, // dein web.de Passwort
      },
    });

    // E-Mail senden
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'mike-managing@gmx.de',
      subject: `Neue Kontaktanfrage von ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a3691; border-bottom: 2px solid #1a3691; padding-bottom: 10px;">
            Neue Kontaktanfrage - PlaySafe
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Kontaktdaten:</h3>
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>E-Mail:</strong> ${email}</p>
            ${phone ? `<p style="margin: 10px 0;"><strong>Telefon:</strong> ${phone}</p>` : ''}
          </div>
          
          <div style="background-color: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #333;">Nachricht:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e8f4fd; border-radius: 8px; font-size: 12px; color: #666;">
            Diese E-Mail wurde automatisch über das Kontaktformular auf playsafe.fit gesendet.
          </div>
        </div>
      `,
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