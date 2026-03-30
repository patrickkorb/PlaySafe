import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, metadata } = body;

    if (!name) {
      return NextResponse.json({ error: 'Goal name fehlt' }, { status: 400 });
    }

    const datafastVisitorId = request.cookies.get('datafast_visitor_id')?.value;

    if (!datafastVisitorId) {
      return NextResponse.json({ error: 'Kein Datafast Visitor Cookie' }, { status: 400 });
    }

    const apiKey = process.env.DATAFAST_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'DATAFAST_API_KEY nicht konfiguriert' }, { status: 500 });
    }

    const response = await fetch('https://datafa.st/api/v1/goals', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        datafast_visitor_id: datafastVisitorId,
        name,
        metadata: metadata || {},
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Datafast API Fehler:', result);
      return NextResponse.json({ error: 'Datafast API Fehler', details: result }, { status: response.status });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Datafast Goal Route Error:', error);
    return NextResponse.json({ error: 'Server-Fehler' }, { status: 500 });
  }
}
