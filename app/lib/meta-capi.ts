import crypto from 'crypto';

// Hash-Funktion für User-Daten (SHA256)
function hashData(data: string | null | undefined): string | undefined {
  if (!data || data.trim() === '') return undefined;
  return crypto
    .createHash('sha256')
    .update(data.toLowerCase().trim())
    .digest('hex');
}

// Normalisiere Telefonnummer (entferne Leerzeichen, Bindestriche, etc.)
function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '');
}

// Event-ID Generator für Deduplizierung
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// Interface für User-Daten
interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

// Interface für Event-Daten
interface EventData {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  actionSource: 'website';
  userData: UserData;
  customData?: {
    currency?: string;
    value?: number;
    [key: string]: any;
  };
}

// Interface für die Conversion API Anfrage
interface ConversionAPIPayload {
  data: Array<{
    event_name: string;
    event_time: number;
    event_id: string;
    event_source_url: string;
    action_source: string;
    user_data: {
      em?: string;
      ph?: string;
      fn?: string;
      ln?: string;
      ct?: string;
      st?: string;
      country?: string;
      zp?: string;
      client_ip_address?: string;
      client_user_agent?: string;
      fbc?: string;
      fbp?: string;
    };
    custom_data?: {
      currency?: string;
      value?: number;
      [key: string]: any;
    };
  }>;
  test_event_code?: string;
}

export async function sendConversionAPIEvent(
  eventData: EventData,
  request?: Request
): Promise<{ success: boolean; error?: string }> {
  try {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE;

    if (!pixelId || !accessToken) {
      console.error('Meta Pixel ID oder Access Token fehlt');
      return { success: false, error: 'Konfiguration fehlt' };
    }

    // Extrahiere IP und User-Agent aus dem Request
    let clientIp: string | undefined;
    let userAgent: string | undefined;
    let fbc: string | undefined;
    let fbp: string | undefined;

    if (request) {
      // IP-Adresse aus verschiedenen Headers versuchen zu extrahieren
      clientIp =
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        undefined;

      userAgent = request.headers.get('user-agent') || undefined;

      // Facebook Click ID und Browser ID aus Cookies
      const cookies = request.headers.get('cookie');
      if (cookies) {
        const fbcMatch = cookies.match(/_fbc=([^;]+)/);
        const fbpMatch = cookies.match(/_fbp=([^;]+)/);
        if (fbcMatch) fbc = fbcMatch[1];
        if (fbpMatch) fbp = fbpMatch[1];
      }
    }

    // Erstelle die Payload mit gehashten User-Daten
    const payload: ConversionAPIPayload = {
      data: [
        {
          event_name: eventData.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventData.eventId,
          event_source_url: eventData.eventSourceUrl,
          action_source: eventData.actionSource,
          user_data: {
            em: hashData(eventData.userData.email),
            ph: eventData.userData.phone
              ? hashData(normalizePhone(eventData.userData.phone))
              : undefined,
            fn: hashData(eventData.userData.firstName),
            ln: hashData(eventData.userData.lastName),
            ct: hashData(eventData.userData.city),
            st: hashData(eventData.userData.state),
            country: hashData(eventData.userData.country),
            zp: hashData(eventData.userData.zipCode),
            client_ip_address: clientIp,
            client_user_agent: userAgent,
            fbc: fbc,
            fbp: fbp,
          },
          custom_data: eventData.customData,
        },
      ],
    };

    // Füge Test Event Code hinzu, falls vorhanden
    if (testEventCode) {
      payload.test_event_code = testEventCode;
    }

    // Sende an Meta Conversion API
    const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI Error:', result);
      return {
        success: false,
        error: result.error?.message || 'Fehler beim Senden'
      };
    }

    console.log('Meta CAPI Event gesendet:', {
      eventName: eventData.eventName,
      eventId: eventData.eventId,
      eventsReceived: result.events_received,
    });

    return { success: true };
  } catch (error) {
    console.error('Meta CAPI Exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unbekannter Fehler'
    };
  }
}
