import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const affirmations = [
  { quote: "You are worthy of love, happiness, and peace.", author: "Daily Affirmation" },
  { quote: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.", author: "Daily Affirmation" },
  { quote: "You don't have to be perfect to be amazing.", author: "Daily Affirmation" },
  { quote: "Healing is not linear, and that's okay.", author: "Daily Affirmation" },
  { quote: "You are stronger than you think and braver than you believe.", author: "A.A. Milne" },
  { quote: "The only way out is through.", author: "Robert Frost" },
  { quote: "You are not your illness. You have an individual story to tell.", author: "Julian Seifter" },
  { quote: "There is hope, even when your brain tells you there isn't.", author: "John Green" },
  { quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { quote: "You, yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha" },
  { quote: "Self-care is not selfish. You cannot serve from an empty vessel.", author: "Eleanor Brownn" },
  { quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { quote: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "You are allowed to be both a masterpiece and a work in progress simultaneously.", author: "Sophia Bush" },
  { quote: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { quote: "Be gentle with yourself. You're doing the best you can.", author: "Daily Affirmation" },
  { quote: "Not until we are lost do we begin to understand ourselves.", author: "Henry David Thoreau" },
  { quote: "The mind is everything. What you think, you become.", author: "Buddha" },
  { quote: "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.", author: "Albus Dumbledore" },
  { quote: "One small positive thought in the morning can change your whole day.", author: "Dalai Lama" },
  { quote: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { quote: "Promise me you'll always remember: You're braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
  { quote: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.", author: "Daily Affirmation" },
  { quote: "You are not a drop in the ocean. You are the entire ocean in a drop.", author: "Rumi" },
  { quote: "The wound is the place where the Light enters you.", author: "Rumi" },
  { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { quote: "Act as if what you do makes a difference. It does.", author: "William James" },
  { quote: "You are enough just as you are.", author: "Meghan Markle" },
  { quote: "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'", author: "Mary Anne Radmacher" },
  { quote: "When you can't find the sunshine, be the sunshine.", author: "Daily Affirmation" },
  { quote: "Every day may not be good, but there is something good in every day.", author: "Alice Morse Earle" },
  { quote: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
  { quote: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
  { quote: "Out of your vulnerabilities will come your strength.", author: "Sigmund Freud" },
  { quote: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { quote: "Nothing is impossible. The word itself says 'I'm possible!'", author: "Audrey Hepburn" },
  { quote: "Inhale courage, exhale fear.", author: "Daily Affirmation" },
  { quote: "What mental health needs is more sunlight, more candor, and more unashamed conversation.", author: "Glenn Close" },
  { quote: "Your illness does not define you. Your strength and courage does.", author: "Daily Affirmation" },
  { quote: "Sometimes the bravest thing you can do is ask for help.", author: "Daily Affirmation" },
  { quote: "It's okay to not be okay, as long as you don't give up.", author: "Daily Affirmation" },
  { quote: "Tough times never last, but tough people do.", author: "Robert H. Schuller" },
  { quote: "The sun himself is weak when he first rises, and gathers strength and courage as the day gets on.", author: "Charles Dickens" },
  { quote: "Mental health problems don't define who you are. They are something you experience.", author: "Daily Affirmation" },
  { quote: "I am not what happened to me. I am what I choose to become.", author: "Carl Jung" },
  { quote: "The strongest people are not those who show strength in front of us, but those who win battles we know nothing about.", author: "Daily Affirmation" },
  { quote: "Just when the caterpillar thought the world was ending, he turned into a butterfly.", author: "Proverb" },
  { quote: "Life doesn't get easier or more forgiving; we get stronger and more resilient.", author: "Steve Maraboli" },
  { quote: "You have within you right now, everything you need to deal with whatever the world throws at you.", author: "Brian Tracy" },
  { quote: "Owning our story and loving ourselves through that process is the bravest thing we'll ever do.", author: "Brené Brown" },
  { quote: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { quote: "Your value doesn't decrease based on someone's inability to see your worth.", author: "Daily Affirmation" },
  { quote: "The human spirit is stronger than anything that can happen to it.", author: "C.C. Scott" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.", author: "Wayne Dyer" },
  { quote: "You are the sky. Everything else is just the weather.", author: "Pema Chödrön" },
  { quote: "Don't believe everything you think.", author: "Daily Affirmation" },
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { quote: "Your calm mind is the ultimate weapon against your challenges.", author: "Bryant McGill" },
  { quote: "Feelings are just visitors. Let them come and go.", author: "Mooji" },
  { quote: "Progress, not perfection, is what we should be asking of ourselves.", author: "Julia Cameron" },
  { quote: "Today I choose joy. Today I choose self-love. Today I choose to be kind to myself.", author: "Daily Affirmation" },
  { quote: "You survived 100% of your worst days. You're doing great.", author: "Daily Affirmation" },
  { quote: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { quote: "If you're going through hell, keep going.", author: "Winston Churchill" },
  { quote: "The secret of change is to focus all of your energy not on fighting the old, but on building the new.", author: "Socrates" },
  { quote: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll" },
  { quote: "You can't stop the waves, but you can learn to surf.", author: "Jon Kabat-Zinn" },
  { quote: "What we achieve inwardly will change outer reality.", author: "Plutarch" },
  { quote: "Take it one day at a time. You are doing better than you think.", author: "Daily Affirmation" },
  { quote: "Breathe. You're going to be okay. You've survived everything up until this point.", author: "Daily Affirmation" },
  { quote: "The comeback is always stronger than the setback.", author: "Daily Affirmation" },
  { quote: "Stars can't shine without darkness.", author: "Daily Affirmation" },
  { quote: "Be patient with yourself. Nothing in nature blooms all year.", author: "Daily Affirmation" },
  { quote: "Let go of who you think you're supposed to be; embrace who you are.", author: "Brené Brown" },
  { quote: "You are deserving of a beautiful life.", author: "Daily Affirmation" },
  { quote: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { quote: "Every morning we are born again. What we do today is what matters most.", author: "Buddha" },
  { quote: "Keep going. Everything you need will come to you at the perfect time.", author: "Daily Affirmation" },
  { quote: "This too shall pass.", author: "Persian Proverb" },
  { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { quote: "Your story isn't over yet. Keep writing.", author: "Daily Affirmation" },
  { quote: "Difficult roads often lead to beautiful destinations.", author: "Zig Ziglar" },
  { quote: "Sometimes you have to let go of the picture of what you thought life would be like and learn to find joy in the story you're living.", author: "Rachel Marie Martin" },
  { quote: "It does not matter how slowly you go, as long as you do not stop.", author: "Confucius" },
  { quote: "Talk to yourself like someone you love.", author: "Brené Brown" },
  { quote: "The broken will always be able to love harder than most because once you've been in the dark, you learn to appreciate everything that shines.", author: "Zachry K. Douglas" },
  { quote: "Healing takes time, and asking for help is a courageous step.", author: "Mariska Hargitay" },
  { quote: "You wake up every morning to fight the same demons that left you so tired the night before, and that, my love, is bravery.", author: "Daily Affirmation" },
  { quote: "Give yourself permission to rest. You are not lazy; you are human.", author: "Daily Affirmation" },
];

const selfCareTips = [
  "Take 5 minutes for deep breathing today.",
  "Drink a full glass of water right now.",
  "Step outside and feel the sunshine for a few minutes.",
  "Write down 3 things you're grateful for.",
  "Stretch your body for 5 minutes.",
  "Call or text someone you care about today.",
  "Take a short walk, even just around the block.",
  "Listen to your favourite song and let yourself enjoy it.",
  "Put your phone down for 30 minutes and be present.",
  "Do one small thing today that makes you smile.",
  "Give yourself a compliment — you deserve it.",
  "Try a 5-minute guided meditation.",
  "Eat a healthy snack that nourishes your body.",
  "Tidy one small space around you — it can ease your mind.",
  "Say 'no' to something that drains your energy today.",
  "Journal about how you're feeling right now.",
  "Take a warm shower or bath to relax.",
  "Spend a few minutes in nature, even just looking at trees.",
  "Set a small, achievable goal for today and celebrate when you reach it.",
  "Remind yourself: progress, not perfection.",
];

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

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, notification_wellness, notification_email')
      .eq('notification_wellness', true)
      .eq('notification_email', true)
      .not('email', 'is', null);

    if (error) throw error;

    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const todaysAffirmation = affirmations[dayOfYear % affirmations.length];
    const todaysTip = selfCareTips[dayOfYear % selfCareTips.length];

    const results: { email: string; success: boolean }[] = [];

    for (const profile of profiles || []) {
      if (!profile.email) continue;

      const firstName = profile.full_name?.split(' ')[0] || 'there';

      const htmlBody = `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <div style="background:linear-gradient(135deg,#f59e0b,#f97316);padding:28px 32px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;">🌅 Your Daily Affirmation</h1>
            <p style="color:#fef3c7;margin:6px 0 0;font-size:13px;">World Changers Mental Health Care</p>
          </div>
          <div style="padding:28px 32px;">
            <p style="color:#374151;font-size:16px;margin:0 0 16px;">Good morning, ${firstName}! ☀️</p>
            <div style="background:linear-gradient(135deg,#fffbeb,#fef3c7);border-left:4px solid #f59e0b;border-radius:8px;padding:20px 24px;margin:0 0 20px;">
              <p style="color:#92400e;font-size:18px;line-height:1.6;margin:0 0 8px;font-style:italic;">"${todaysAffirmation.quote}"</p>
              <p style="color:#b45309;font-size:13px;margin:0;font-weight:600;">— ${todaysAffirmation.author}</p>
            </div>
            <div style="background:#f0fdf4;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
              <p style="color:#166534;font-size:13px;margin:0 0 4px;font-weight:600;">🌿 Today's Self-Care Tip</p>
              <p style="color:#15803d;font-size:14px;line-height:1.5;margin:0;">${todaysTip}</p>
            </div>
            <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 20px;">
              Start your day with intention. Remember, every small step you take towards your wellness matters. You are worthy of a beautiful day. 💛
            </p>
            <div style="text-align:center;margin:24px 0 8px;">
              <a href="https://heart-heal-hope.lovable.app/mood-tracker" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#f97316);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">Track Your Mood Today</a>
            </div>
            <p style="text-align:center;color:#9ca3af;font-size:12px;margin:8px 0 0;">How are you feeling this morning? ✨</p>
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
            subject: `🌅 Your Daily Affirmation, ${firstName}`,
            html: htmlBody,
          }),
        });

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
