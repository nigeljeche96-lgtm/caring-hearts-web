import { escapeHtml as e } from '../_shared/escape.ts';
import { sendLovableEmail } from 'npm:@lovable.dev/email-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SITE_NAME = 'World Changers MHC';
const SENDER_DOMAIN = 'notify.worldchangersmh.org';
const FROM_ADDRESS = 'info@worldchangersmh.org';
const CONTACT_INBOX = 'info@worldchangersmh.org';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apikey = req.headers.get('apikey') || req.headers.get('Authorization');
    if (!apikey) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const raw = await req.json();
    const full_name = e(raw.full_name);
    const email = String(raw.email || '').trim();
    const subject = e(raw.subject);
    const message = e(raw.message).replace(/\n/g, '<br/>');

    if (!email || !raw.full_name || !raw.subject || !raw.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const htmlBody = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#034694;padding:28px 32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">New Contact Message</h1>
          <p style="color:#cfe0f5;margin:6px 0 0;font-size:13px;">World Changers Mental Health Care Organisation</p>
        </div>
        <div style="padding:28px 32px;">
          <p style="color:#374151;font-size:15px;margin:0 0 20px;">A new message has been received from the contact form:</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="padding:10px 16px;color:#6b7280;font-size:13px;border-bottom:1px solid #e5e7eb;width:140px;">Name</td><td style="padding:10px 16px;color:#111827;font-size:14px;font-weight:600;border-bottom:1px solid #e5e7eb;">${full_name}</td></tr>
            <tr><td style="padding:10px 16px;color:#6b7280;font-size:13px;border-bottom:1px solid #e5e7eb;width:140px;">Email</td><td style="padding:10px 16px;color:#111827;font-size:14px;font-weight:600;border-bottom:1px solid #e5e7eb;">${e(email)}</td></tr>
            <tr><td style="padding:10px 16px;color:#6b7280;font-size:13px;border-bottom:1px solid #e5e7eb;width:140px;">Subject</td><td style="padding:10px 16px;color:#111827;font-size:14px;font-weight:600;border-bottom:1px solid #e5e7eb;">${subject}</td></tr>
          </table>
          <h3 style="font-size:14px;color:#034694;margin:0 0 8px;">Message</h3>
          <p style="color:#374151;font-size:14px;line-height:1.6;background:#f9fafb;padding:12px 16px;border-radius:8px;margin:0;">${message}</p>
        </div>
      </div>`;

    const textBody = [
      'New contact message',
      `Name: ${raw.full_name}`,
      `Email: ${email}`,
      `Subject: ${raw.subject}`,
      '',
      String(raw.message),
    ].join('\n');

    const ackHtml = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#034694;padding:28px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;">Thank You for Contacting Us</h1>
          <p style="color:#cfe0f5;margin:8px 0 0;font-size:13px;">World Changers Mental Health Care Organisation</p>
        </div>
        <div style="padding:28px;">
          <p style="color:#374151;font-size:15px;margin:0 0 16px;">Hi ${full_name},</p>
          <p style="color:#374151;font-size:15px;margin:0 0 16px;">We have received your message and a member of our team will get back to you as soon as possible.</p>
          <p style="color:#6b7280;font-size:13px;margin:0 0 6px;"><strong>Your subject:</strong> ${subject}</p>
          <p style="color:#374151;font-size:14px;line-height:1.6;background:#f9fafb;padding:12px 16px;border-radius:8px;margin:0;">${message}</p>
          <p style="color:#6b7280;font-size:13px;margin:20px 0 0;">Please note this is not an emergency service. If you are in crisis, call the SADAG helpline on 0800 567 567.</p>
        </div>
      </div>`;

    const ackText = [
      `Hi ${raw.full_name},`,
      '',
      'We have received your message and a member of our team will get back to you as soon as possible.',
      '',
      `Your subject: ${raw.subject}`,
      String(raw.message),
      '',
      'World Changers Mental Health Care Organisation',
    ].join('\n');

    try {
      const result = await sendLovableEmail(
        {
          to: CONTACT_INBOX,
          from: { name: `${SITE_NAME} Contact`, address: FROM_ADDRESS },
          sender_domain: SENDER_DOMAIN,
          reply_to: email,
          subject: `New Contact: ${String(raw.subject).slice(0, 120)} — ${String(raw.full_name).slice(0, 80)}`,
          html: htmlBody,
          text: textBody,
          purpose: 'transactional',
          label: 'contact-notification',
          idempotency_key: crypto.randomUUID(),
        },
        { apiKey: LOVABLE_API_KEY },
      );

      try {
        await sendLovableEmail(
          {
            to: email,
            from: { name: SITE_NAME, address: FROM_ADDRESS },
            sender_domain: SENDER_DOMAIN,
            reply_to: CONTACT_INBOX,
            subject: 'We have received your message',
            html: ackHtml,
            text: ackText,
            purpose: 'transactional',
            label: 'contact-acknowledgement',
            idempotency_key: crypto.randomUUID(),
          },
          { apiKey: LOVABLE_API_KEY },
        );
      } catch (ackErr) {
        console.error('Contact acknowledgement email failed:', (ackErr as Error).message);
      }

      return new Response(JSON.stringify({ success: true, id: result.message_id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (sendErr) {
      console.error('Contact notification email failed:', (sendErr as Error).message);
      return new Response(
        JSON.stringify({ success: false, error: 'Email delivery failed', details: (sendErr as Error).message }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
