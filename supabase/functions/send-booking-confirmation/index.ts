import { escapeHtml as e } from '../_shared/escape.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require a Supabase apikey header (sent automatically by supabase-js) to
    // gate the endpoint against unauthenticated abuse.
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
    const validProviderEmail = provider_email && emailRegex.test(provider_email) ? provider_email : null;

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #1a6b4a, #2d9d6f); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Booking Confirmed ✓</h1>
          <p style="color: #d1fae5; margin: 8px 0 0; font-size: 14px;">World Changers Mental Health Care Org</p>
        </div>
        <div style="padding: 32px;">
          <p style="color: #374151; font-size: 16px; margin: 0 0 24px;">Hi <strong>${full_name}</strong>,</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            Your therapy session has been successfully booked. Here are your details:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 12px 16px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 13px; width: 140px;">Provider</td>
              <td style="padding: 12px 16px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; font-weight: 600;">${provider_name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 13px;">Session Type</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; font-weight: 600;">${session_type}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 13px;">Date</td>
              <td style="padding: 12px 16px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; font-weight: 600;">${session_date}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 13px;">Time</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; font-weight: 600;">${session_time}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; background: #f9fafb; color: #6b7280; font-size: 13px;">Mode</td>
              <td style="padding: 12px 16px; background: #f9fafb; color: #111827; font-size: 14px; font-weight: 600;">${session_mode || 'Virtual'}</td>
            </tr>
          </table>
          <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0;">
            If you need to reschedule or cancel, please contact us at least 24 hours before your appointment.
          </p>
        </div>
        <div style="background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© World Changers Mental Health Care Org. All rights reserved.</p>
        </div>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'World Changers MHC Bookings <bookings@worldchangersmh.org>',
        // Notification goes to the selected professional; the client is copied
        // so they also receive their confirmation.
        to: [validProviderEmail || 'info@worldchangersmh.org'],
        cc: ['info@worldchangersmh.org', validProviderEmail ? email : null].filter(Boolean),
        reply_to: email,
        subject: `New Booking — ${String(raw.session_type || '').slice(0,80)} with ${String(raw.provider_name || '').slice(0,80)}`,
        html: htmlBody + `<div style="font-family:Arial,sans-serif;max-width:600px;margin:16px auto;padding:16px;background:#f9fafb;border-radius:8px;font-size:13px;color:#374151;"><strong>Client contact:</strong><br/>Email: ${e(email)}<br/>Phone: ${phone}<br/>Reason: ${reason}</div>`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Booking notification email failed:', res.status, data);
      return new Response(JSON.stringify({ success: false, error: 'Email delivery failed', status: res.status, details: data }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
