import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require a shared cron secret OR the service role key to invoke this mass-email function.
    const cronSecret = Deno.env.get('CRON_SECRET');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const auth = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') || '';
    const headerSecret = req.headers.get('x-cron-secret') || '';
    const authorized =
      (cronSecret && (auth === cronSecret || headerSecret === cronSecret)) ||
      (serviceRoleKey && auth === serviceRoleKey);
    if (!authorized) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get all profiles with email notifications and wellness notifications enabled
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, notification_wellness, notification_email')
      .eq('notification_wellness', true)
      .eq('notification_email', true)
      .not('email', 'is', null);

    if (error) throw error;

    const results: { email: string; success: boolean }[] = [];

    for (const profile of profiles || []) {
      if (!profile.email) continue;

      const firstName = profile.full_name?.split(' ')[0] || 'there';

      const htmlBody = `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <div style="background:linear-gradient(135deg,#1a6b4a,#2d9d6f);padding:28px 32px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;">🌿 Daily Mood Check-In</h1>
            <p style="color:#d1fae5;margin:6px 0 0;font-size:13px;">World Changers Mental Health Care</p>
          </div>
          <div style="padding:28px 32px;">
            <p style="color:#374151;font-size:16px;margin:0 0 12px;">Hi ${firstName},</p>
            <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
              Taking a moment to reflect on how you're feeling can make a big difference in your mental wellness journey. 
              Your daily mood log helps you track patterns and celebrate progress.
            </p>
            <div style="background:#f0fdf4;border-radius:8px;padding:16px 20px;margin:0 0 24px;text-align:center;">
              <p style="color:#166534;font-size:14px;margin:0 0 4px;font-weight:600;">How are you feeling today?</p>
              <p style="font-size:28px;margin:0;">😢 😟 😐 🙂 😄</p>
            </div>
            <div style="text-align:center;margin:24px 0 8px;">
              <a href="https://heart-heal-hope.lovable.app/mood-tracker" style="display:inline-block;background:linear-gradient(135deg,#1a6b4a,#2d9d6f);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">Log My Mood</a>
            </div>
            <p style="text-align:center;color:#9ca3af;font-size:12px;margin:8px 0 0;">It only takes a few seconds ✨</p>
          </div>
          <div style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#9ca3af;font-size:11px;margin:0;">You're receiving this because you opted in to wellness reminders. Update your preferences in your profile settings.</p>
            <p style="color:#9ca3af;font-size:11px;margin:4px 0 0;">© World Changers Mental Health Care Org</p>
          </div>
        </div>
      `;

      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'World Changers MHC Wellness <onboarding@resend.dev>',
            to: [profile.email],
            subject: `🌿 How are you feeling today, ${firstName}?`,
            html: htmlBody,
          }),
        });

        const data = await res.json();
        results.push({ email: profile.email, success: res.ok });
      } catch (emailErr) {
        console.error("Failed to send reminder to a member:", emailErr instanceof Error ? emailErr.message : "unknown error");
        results.push({ email: profile.email, success: false });
      }
    }

    return new Response(JSON.stringify({ sent: results.length, results }), {
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
