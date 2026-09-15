import { escapeHtml as e } from '../_shared/escape.ts';
import { sendLovableEmail } from 'npm:@lovable.dev/email-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SITE_NAME = 'World Changers MHC';
const SENDER_DOMAIN = 'notify.worldchangersmh.org';
const FROM_ADDRESS = 'volunteers@worldchangersmh.org';
const VOLUNTEER_INBOX = 'hr@worldchangersmh.org';
const CC_INBOX = 'info@worldchangersmh.org';

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

    const body = await req.json();
    const first_name = e(body.first_name);
    const last_name = e(body.last_name);
    const email = String(body.email || '').trim();
    const phone = e(body.phone);
    const date_of_birth = e(body.date_of_birth);
    const city = e(body.city);
    const address = e(body.address);
    const area_of_interest = e(body.area_of_interest);
    const availability = e(body.availability);
    const previous_experience = e(body.previous_experience);
    const motivation = e(body.motivation).replace(/\n/g, '<br/>');
    const special_skills = e(body.special_skills);
    const emergency_contact_name = e(body.emergency_contact_name);
    const emergency_contact_phone = e(body.emergency_contact_phone);

    if (!email || !body.first_name || !body.last_name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const row = (label: string, value: string) =>
      value ? `<tr><td style="padding:10px 16px;color:#6b7280;font-size:13px;border-bottom:1px solid #e5e7eb;width:180px;">${label}</td><td style="padding:10px 16px;color:#111827;font-size:14px;font-weight:600;border-bottom:1px solid #e5e7eb;">${value}</td></tr>` : '';

    const htmlBody = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#034694;padding:28px 32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">New Volunteer Application</h1>
          <p style="color:#cfe0f5;margin:6px 0 0;font-size:13px;">World Changers Mental Health Care Organisation</p>
        </div>
        <div style="padding:28px 32px;">
          <p style="color:#374151;font-size:15px;margin:0 0 20px;">A new volunteer application has been submitted:</p>
          <h3 style="font-size:14px;color:#034694;margin:0 0 8px;">Personal Information</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            ${row('Name', `${first_name} ${last_name}`)}
            ${row('Email', e(email))}
            ${row('Phone', phone)}
            ${row('Date of Birth', date_of_birth)}
            ${row('City', city)}
            ${row('Address', address)}
          </table>
          <h3 style="font-size:14px;color:#034694;margin:0 0 8px;">Volunteer Details</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            ${row('Area of Interest', area_of_interest)}
            ${row('Availability', availability)}
            ${row('Previous Experience', previous_experience)}
            ${row('Special Skills', special_skills)}
          </table>
          <h3 style="font-size:14px;color:#034694;margin:0 0 8px;">Motivation</h3>
          <p style="color:#374151;font-size:14px;line-height:1.6;background:#f9fafb;padding:12px 16px;border-radius:8px;margin:0 0 20px;">${motivation}</p>
          ${emergency_contact_name ? `
          <h3 style="font-size:14px;color:#034694;margin:0 0 8px;">Emergency Contact</h3>
          <table style="width:100%;border-collapse:collapse;">
            ${row('Name', emergency_contact_name)}
            ${row('Phone', emergency_contact_phone)}
          </table>` : ''}
        </div>
      </div>`;

    const textBody = [
      'New volunteer application',
      `Name: ${body.first_name} ${body.last_name}`,
      `Email: ${email}`,
      `Phone: ${body.phone || '-'}`,
      `Area of interest: ${body.area_of_interest || '-'}`,
      `Availability: ${body.availability || '-'}`,
      '',
      `Motivation: ${body.motivation || '-'}`,
    ].join('\n');

    const ackHtml = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#034694;padding:28px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;">Your Volunteer Application Was Received</h1>
          <p style="color:#cfe0f5;margin:8px 0 0;font-size:13px;">World Changers Mental Health Care Organisation</p>
        </div>
        <div style="padding:28px;">
          <p style="color:#374151;font-size:15px;margin:0 0 16px;">Hi ${first_name},</p>
          <p style="color:#374151;font-size:15px;margin:0 0 20px;">Thank you for applying to volunteer with us. We have received your application and our volunteer coordination team will review it and get in touch with you about the next steps.</p>
          <table style="width:100%;border-collapse:collapse;">
            ${row('Area of Interest', area_of_interest)}
            ${row('Availability', availability)}
          </table>
          <p style="color:#6b7280;font-size:13px;margin:20px 0 0;">Questions? Reply to this email or write to hr@worldchangersmh.org.</p>
        </div>
      </div>`;

    const ackText = [
      `Hi ${body.first_name},`,
      '',
      'Thank you for applying to volunteer with us. We have received your application and our volunteer coordination team will review it and get in touch with you about the next steps.',
      '',
      `Area of interest: ${body.area_of_interest || '-'}`,
      `Availability: ${body.availability || '-'}`,
      '',
      'World Changers Mental Health Care Organisation',
    ].join('\n');

    try {
      const result = await sendLovableEmail(
        {
          to: VOLUNTEER_INBOX,
          cc: [CC_INBOX],
          from: { name: `${SITE_NAME} Volunteers`, address: FROM_ADDRESS },
          sender_domain: SENDER_DOMAIN,
          reply_to: email,
          subject: `New Volunteer Application — ${String(body.first_name).slice(0, 60)} ${String(body.last_name).slice(0, 60)}`,
          html: htmlBody,
          text: textBody,
          purpose: 'transactional',
          label: 'volunteer-notification',
          idempotency_key: crypto.randomUUID(),
        },
        { apiKey: LOVABLE_API_KEY },
      );

      try {
        await sendLovableEmail(
          {
            to: email,
            from: { name: `${SITE_NAME} Volunteers`, address: FROM_ADDRESS },
            sender_domain: SENDER_DOMAIN,
            reply_to: VOLUNTEER_INBOX,
            subject: 'We have received your volunteer application',
            html: ackHtml,
            text: ackText,
            purpose: 'transactional',
            label: 'volunteer-acknowledgement',
            idempotency_key: crypto.randomUUID(),
          },
          { apiKey: LOVABLE_API_KEY },
        );
      } catch (ackErr) {
        console.error('Volunteer acknowledgement email failed:', (ackErr as Error).message);
      }

      return new Response(JSON.stringify({ success: true, id: result.message_id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (sendErr) {
      console.error('Volunteer notification email failed:', (sendErr as Error).message);
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
