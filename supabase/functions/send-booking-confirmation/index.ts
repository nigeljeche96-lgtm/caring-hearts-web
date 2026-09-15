import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

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
    const email = String(raw.email || '').trim();
    const provider_email = String(raw.provider_email || '').trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !raw.full_name || !emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const templateData = {
      fullName: String(raw.full_name || '').slice(0, 120),
      email,
      phone: String(raw.phone || '—').slice(0, 60),
      providerName: String(raw.provider_name || '—').slice(0, 120),
      sessionType: String(raw.session_type || '—').slice(0, 120),
      sessionDate: String(raw.session_date || '—').slice(0, 60),
      sessionTime: String(raw.session_time || '—').slice(0, 60),
      sessionMode: String(raw.session_mode || 'Virtual').slice(0, 60),
      reason: String(raw.reason || '—').slice(0, 1000),
    };

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) {
      throw new Error('Server configuration error');
    }
    const supabase = createClient(supabaseUrl, serviceKey);

    // Notify the bookings inbox, plus the selected professional (separate send).
    const recipients = [BOOKINGS_INBOX];
    if (provider_email && emailRegex.test(provider_email) && provider_email.toLowerCase() !== BOOKINGS_INBOX) {
      recipients.push(provider_email);
    }

    const results = await Promise.all(
      recipients.map((to) =>
        supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'booking-notification',
            recipientEmail: to,
            templateData,
          },
        })
      )
    );

    const failed = results.filter((r) => r.error);
    if (failed.length === recipients.length) {
      const details = await Promise.all(
        failed.map(async (f: any) =>
          f.error?.context?.text ? await f.error.context.text() : String(f.error?.message || f.error)
        )
      );
      console.error('Booking notification email failed:', details);
      return new Response(
        JSON.stringify({ success: false, error: 'Email delivery failed', details }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true, queued: recipients.length - failed.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
