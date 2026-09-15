import { escapeHtml as e } from '../_shared/escape.ts';
import { sendLovableEmail } from 'npm:@lovable.dev/email-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SITE_NAME = 'World Changers MHC';
const SENDER_DOMAIN = 'notify.worldchangersmh.org';
const FROM_ADDRESS = 'bookings@worldchangersmh.org';
const BOOKINGS_INBOX = 'help@worldchangersmh.org';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apikey = req.headers.get('apikey') || req.headers.get('Authorization');
    if (!apikey) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const raw = await req.json();
    const full_name = e(raw.full_name);
    const email = String(raw.email || '').trim();
    const provider_email = String(raw.provider_email || '').trim();
    const provider_name = e(raw.provider_name);
    const session_type = e(raw.session_type);
    const session_date = e(raw.session_date);
    const session_time = e(raw.session_time);
    const session_mode = e(raw.session_mode);
    const phone = e(raw.phone || '');
    const reason = e(raw.reason || '');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !raw.full_name || !emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const validProviderEmail =
      provider_email && emailRegex.test(provider_email) && provider_email.toLowerCase() !== BOOKINGS_INBOX
        ? provider_email
        : null;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const row = (label: string, value: string) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;width:150px;">${label}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;font-weight:600;">${value || '—'}</td>
      </tr>`;

    const htmlBody = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#034694;padding:28px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;">New Session Booking</h1>
          <p style="color:#cfe0f5;margin:8px 0 0;font-size:13px;">World Changers Mental Health Care Organisation</p>
        </div>
        <div style="padding:28px;">
          <p style="color:#374151;font-size:15px;margin:0 0 20px;">A new counselling session has been booked through the website.</p>
          <table style="width:100%;border-collapse:collapse;">
            ${row('Client', full_name)}
            ${row('Email', e(email))}
            ${row('Phone', phone)}
            ${row('Professional', provider_name)}
            ${row('Session type', session_type)}
            ${row('Date', session_date)}
            ${row('Time', session_time)}
            ${row('Mode', session_mode || 'Virtual')}
            ${row('Reason', reason)}
          </table>
        </div>
      </div>`;

    const textBody = [
      'New session booking',
      `Client: ${raw.full_name}`,
      `Email: ${email}`,
      `Phone: ${raw.phone || '-'}`,
      `Professional: ${raw.provider_name || '-'}`,
      `Session type: ${raw.session_type || '-'}`,
      `Date: ${raw.session_date || '-'}`,
      `Time: ${raw.session_time || '-'}`,
      `Mode: ${raw.session_mode || 'Virtual'}`,
      `Reason: ${raw.reason || '-'}`,
    ].join('\n');

    const ackHtml = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#034694;padding:28px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;">We've Received Your Appointment Request</h1>
          <p style="color:#cfe0f5;margin:8px 0 0;font-size:13px;">World Changers Mental Health Care Organisation</p>
        </div>
        <div style="padding:28px;">
          <p style="color:#374151;font-size:15px;margin:0 0 16px;">Hi ${full_name},</p>
          <p style="color:#374151;font-size:15px;margin:0 0 20px;">Thank you for booking a session with us. We have received your appointment request and <strong>${provider_name || 'your professional'}</strong> will get in touch with you to confirm the details.</p>
          <table style="width:100%;border-collapse:collapse;">
            ${row('Professional', provider_name)}
            ${row('Session type', session_type)}
            ${row('Date', session_date)}
            ${row('Time', session_time)}
            ${row('Mode', session_mode || 'Virtual')}
          </table>
          <p style="color:#6b7280;font-size:13px;margin:20px 0 0;">If you need to change or cancel, simply reply to this email or contact help@worldchangersmh.org.</p>
        </div>
      </div>`;

    const ackText = [
      `Hi ${raw.full_name},`,
      '',
      `Thank you for booking a session with us. We have received your appointment request and ${raw.provider_name || 'your professional'} will get in touch with you to confirm the details.`,
      '',
      `Professional: ${raw.provider_name || '-'}`,
      `Session type: ${raw.session_type || '-'}`,
      `Date: ${raw.session_date || '-'}`,
      `Time: ${raw.session_time || '-'}`,
      `Mode: ${raw.session_mode || 'Virtual'}`,
      '',
      'World Changers Mental Health Care Organisation',
    ].join('\n');

    try {
      const result = await sendLovableEmail(
        {
          to: BOOKINGS_INBOX,
          ...(validProviderEmail ? { cc: [validProviderEmail] } : {}),
          from: { name: `${SITE_NAME} Bookings`, address: FROM_ADDRESS },
          sender_domain: SENDER_DOMAIN,
          reply_to: email,
          subject: `New Booking — ${String(raw.session_type || 'Session').slice(0, 80)} with ${String(raw.provider_name || '').slice(0, 80)}`,
          html: htmlBody,
          text: textBody,
          purpose: 'transactional',
          label: 'booking-notification',
          idempotency_key: crypto.randomUUID(),
        },
        { apiKey: LOVABLE_API_KEY },
      );

      // Acknowledgement to the client (non-blocking)
      try {
        await sendLovableEmail(
          {
            to: email,
            from: { name: `${SITE_NAME} Bookings`, address: FROM_ADDRESS },
            sender_domain: SENDER_DOMAIN,
            reply_to: BOOKINGS_INBOX,
            subject: 'We have received your appointment request',
            html: ackHtml,
            text: ackText,
            purpose: 'transactional',
            label: 'booking-acknowledgement',
            idempotency_key: crypto.randomUUID(),
          },
          { apiKey: LOVABLE_API_KEY },
        );
      } catch (ackErr) {
        console.error('Booking acknowledgement email failed:', (ackErr as Error).message);
      }

      return new Response(JSON.stringify({ success: true, id: result.message_id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (sendErr) {
      const status = (sendErr as any)?.status ?? 502;
      console.error('Booking notification email failed:', status, (sendErr as Error).message);
      return new Response(
        JSON.stringify({ success: false, error: 'Email delivery failed', status, details: (sendErr as Error).message }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
