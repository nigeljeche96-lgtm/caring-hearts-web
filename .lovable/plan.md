# Site Updates: Branding, FAQ, Emergency Info, Translations, Volunteer Routing

## 1. Brand colour update (#034694)

Replace recently introduced grey tones with the World Changers brand blue.

- Update `--primary` (and `--ring`, `--teal-dark`, `--hero-gradient`) in `src/index.css` to `hsl(214 96% 30%)` (= `#034694`) so every `bg-primary`, `text-primary`, `bg-hero-gradient`, gradient text, and shadow token shifts automatically.
- Audit for any lingering `text-gray-*` / `bg-gray-*` / `bg-muted` misused as brand accents introduced in recent changes (Team socials, Partnerships cards, Policies, VoiceAgent button) and re-point them to `primary` / `accent` semantic tokens.
- Leave neutral `muted` / `border` greys alone — they are structural, not brand.

## 2. FAQ page content

`src/pages/FAQ.tsx` currently renders 8 questions from i18n keys `faq.q1..q8`. Expand to ~12 questions covering: what WCMHCO does, who can access services, cost, booking a session, therapist qualifications, crisis/emergency (link to SADAG), confidentiality, volunteering, partnerships/corporate, donations & tax receipts, refund policy, and contact.

- Extend the `faqs` array and matching keys `faq.q1..q12` / `faq.a1..a12` in all 6 locale files.
- FAQPage JSON-LD auto-regenerates from the array.

## 3. SADAG 24/7 emergency contact on Mental Health page

Add a prominent, high-contrast emergency banner at the very top of `src/pages/MentalHealth.tsx` (above Call Now / Book Session), styled with the destructive/accent tone so it stands out.

Content:
- Heading: "In a crisis? Get help now"
- SADAG Suicide Crisis Line: **0800 567 567** (24/7)
- SADAG Mental Health Line: **011 234 4837**
- SMS: **31393** or **32312**
- WhatsApp: **076 882 2775** (9am–5pm)
- Note: "If life is in immediate danger, call 10111 (SAPS) or 10177 (ambulance)."

All copy goes through i18n keys `mentalHealth.emergency.*` so it translates too.

## 4. Complete multilingual translations

- `src/i18n/locales/pt.json` is only 17 lines — it needs a full translation to match `en.json` (~350 lines).
- Diff each of `zu.json`, `af.json`, `fr.json`, `es.json` against `en.json`; add any missing keys (Partnerships, Policies, Mental Health emergency block, new FAQ entries, Volunteer form labels currently hard-coded on lines ~161/183).
- Replace remaining hard-coded English strings in `BecomeVolunteer.tsx` with `t(...)` calls.

## 5. Volunteer submissions -> hr@worldchangersmh.org

Route volunteer applications to HR while keeping the DB record.

- `supabase/functions/send-volunteer-notification/index.ts`: change `to: ['info@worldchangersmh.org']` to `to: ['hr@worldchangersmh.org']`, keep `info@` on CC, set `reply_to` to the applicant.
- Update the confirmation copy in `BecomeVolunteer.tsx` / i18n to reference HR.
- Redeploy the edge function.

## Out of scope
- No changes to booking flow, Paystack, Shopify, MCP server, or security policies.
- No new pages, no nav changes.

## Technical notes
- `#034694` in HSL ≈ `214 96% 30%`; verify by eye in preview after swap.
- Portuguese translation will be produced by translating the English source file key-for-key (no machine placeholders left in).
- Emergency banner uses semantic `destructive` background with white foreground; verify contrast passes AA.
