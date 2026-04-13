import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

export function middleware(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fbclid = searchParams.get('fbclid')

  if (fbclid) {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN

    if (pixelId && accessToken) {
      const eventId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      const clientIp =
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        undefined
      const userAgent = request.headers.get('user-agent') || undefined

      // fbc aus fbclid aufbauen (Meta-Standard-Format)
      const fbc = `fb.1.${Date.now()}.${fbclid}`
      const fbp = request.cookies.get('_fbp')?.value

      const payload: Record<string, unknown> = {
        data: [
          {
            event_name: 'PageView',
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            event_source_url: request.url,
            action_source: 'website',
            user_data: {
              client_ip_address: clientIp,
              client_user_agent: userAgent,
              fbc,
              fbp,
            },
          },
        ],
      }

      const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE
      if (testEventCode) {
        payload.test_event_code = testEventCode
      }

      // Im Hintergrund senden – blockiert die User-Response nicht
      waitUntil(
        fetch(
          `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        ).catch((err) => console.error('Meta CAPI Middleware Error:', err))
      )
    }
  }

  return NextResponse.next()
}