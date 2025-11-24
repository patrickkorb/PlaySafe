import { NextRequest, NextResponse } from 'next/server';
import { sendConversionAPIEvent } from '@/app/lib/meta-capi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, eventId, eventSourceUrl, userData, customData } = body;

    // Validierung
    if (!eventName || !eventId || !eventSourceUrl) {
      return NextResponse.json(
        { error: 'Fehlende erforderliche Felder' },
        { status: 400 }
      );
    }

    // Sende Event an Meta Conversion API
    const result = await sendConversionAPIEvent(
      {
        eventName,
        eventId,
        eventSourceUrl,
        actionSource: 'website',
        userData: userData || {},
        customData,
      },
      request
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Fehler beim Senden an Meta CAPI' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event erfolgreich an Meta Conversion API gesendet',
    });
  } catch (error) {
    console.error('Meta CAPI Route Error:', error);
    return NextResponse.json(
      { error: 'Server-Fehler' },
      { status: 500 }
    );
  }
}
