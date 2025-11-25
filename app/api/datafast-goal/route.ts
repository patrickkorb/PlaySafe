import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { goalName, metadata } = await request.json();

    if (!goalName) {
      return NextResponse.json(
        { error: 'Goal name is required' },
        { status: 400 }
      );
    }

    // Get Datafast visitor ID from cookies
    const cookieStore = await cookies();
    const datafastVisitorId = cookieStore.get('datafast_visitor_id')?.value;

    if (!datafastVisitorId) {
      return NextResponse.json(
        { error: 'Datafast visitor ID not found. User must have at least one pageview.' },
        { status: 400 }
      );
    }

    // Send goal to Datafast API
    const response = await fetch('https://datafa.st/api/v1/goals', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DATAFAST_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        datafast_visitor_id: datafastVisitorId,
        name: goalName,
        metadata: metadata || {},
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Datafast API error:', data);
      return NextResponse.json(
        { error: 'Failed to track goal', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Server error while tracking goal' },
      { status: 500 }
    );
  }
}
