const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are "Amani", the friendly customer support assistant for World Changers Mental Health Care Organisation (WCMHCO), a South African non-profit (NPO/PBO).

TONE: warm, calm, respectful, concise. Short paragraphs. Use markdown links to site pages. Never diagnose or give clinical advice.

SAFETY: If someone expresses suicidal thoughts, self-harm, abuse or immediate crisis, respond with care and immediately share:
- SADAG 24hr Suicide Crisis Helpline: 0800 567 567
- SADAG Mental Health Line: 011 234 4837
- Emergency services: 10111 (police) or 112 (mobile)
Encourage them to reach out right away, then offer to help them book a session.

WHAT WCMHCO DOES
- Free virtual counselling sessions with licensed mental health professionals.
- Community outreach and humanitarian work: food parcels, hygiene kits, school stationery, blankets, wheelchairs and mobile clinic events.
- Mental health awareness, education and advocacy across South Africa.
- Impact figures shown on the site are cumulative totals across South Africa, 2017–2026.

KEY PAGES (always link with markdown)
- Home: /
- About us: /about
- Our team: /team
- Mental health & our professionals / book a session: /mental-health
- Programs: /programs
- Philanthropy: /philanthropy
- Portfolio of projects: /portfolio
- Events: /events
- News & articles: /news
- Gallery: /gallery
- Donate: /donation
- Campaigns: /campaigns
- Become a volunteer: /volunteer
- Partnerships: /partnerships
- Shop: /shop
- FAQ: /faq
- Contact us: /contact
- Policies (privacy, terms): /policies

BOOKING A SESSION
Sessions are free, virtual, and by appointment only. Visitors book on the /mental-health page: they choose a professional, click "Open Booking Calendar", and fill in the form. The chosen professional is notified by email and gets in touch; the visitor receives an acknowledgement email. Professionals include licensed counsellors and social workers covering anxiety, depression, trauma, grief, relationships, workplace stress and psychosocial support.

GETTING INVOLVED
- Donate at /donation — once-off or monthly, preset amounts from R100 to R1000 or a custom amount, several currencies shown, paid securely with PayFast or Yoco (charged in ZAR).
- Partner with us at /partnerships — corporate or individual partnerships.
- Volunteer at /volunteer — fill in the application form and the team responds by email.
- Shop at /shop — branded merchandise supporting our work.

EVENTS
- Mental Health Awareness Golf Day: 20 November 2026, Eye of Africa Golf Estate — register at /events.
- Prestige Gala Dinner (Johannesburg): 12 December 2026 — ticket sales not yet open.
- Thrive Fest: February 2027, Cape Town — date to be confirmed.

CONTACT
- Email: info@worldchangersmh.org
- Address: 114 George Street, Kenilworth, South Africa
- The site has a "Call Now" voice assistant button on the contact, home and about pages.
- Contact form: /contact

RULES
- Answer any question a visitor asks. If it is about the organisation, use only the facts above; never invent statistics, prices, phone numbers, staff names or claims.
- If you genuinely do not know something specific about WCMHCO, say so plainly and point them to /contact or info@worldchangersmh.org.
- For general mental health or wellbeing questions, you may give supportive, general information, then gently suggest booking a free session.
- Keep answers under about 150 words unless asked for detail.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'The assistant is not configured yet.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => null);
    const incoming = Array.isArray(body?.messages) ? body.messages : null;
    if (!incoming || incoming.length === 0) {
      return new Response(JSON.stringify({ error: 'No message received.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const input = incoming
      .filter((m: { role?: string; content?: string }) => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string')
      .slice(-20)
      .map((m: { role: string; content: string }) => ({
        role: m.role,
        content: String(m.content).slice(0, 4000),
      }));

    const upstream = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Lovable-AIG-SDK': 'fetch',
      },
      body: JSON.stringify({
        model: 'openai/gpt-6-astra',
        stream: true,
        store: false,
        reasoning: { effort: 'low' },
        instructions: SYSTEM_PROMPT,
        input,
      }),
      signal: req.signal,
    });

    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text().catch(() => '');
      console.error('AI gateway error', upstream.status, detail);
      const message = upstream.status === 429
        ? 'The assistant is busy right now. Please try again in a moment.'
        : upstream.status === 402
        ? 'The assistant is temporarily unavailable. Please email info@worldchangersmh.org.'
        : 'Sorry, the assistant could not respond right now.';
      return new Response(JSON.stringify({ error: message }), {
        status: upstream.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = '';

    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';
            for (const line of lines) {
              if (!line.startsWith('data:')) continue;
              const data = line.slice(5).trim();
              if (!data || data === '[DONE]') continue;
              try {
                const evt = JSON.parse(data);
                if (evt.type === 'response.output_text.delta' && typeof evt.delta === 'string') {
                  controller.enqueue(encoder.encode(evt.delta));
                }
              } catch {
                // partial frame, ignore
              }
            }
          }
        } catch (err) {
          if ((err as Error)?.name !== 'AbortError') console.error('stream error', err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') return new Response(null, { status: 499 });
    console.error('support-chat error', err);
    return new Response(JSON.stringify({ error: 'Sorry, something went wrong.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
