# WCMHCO Donation and Google Ad Grants Readiness Overhaul

## Goal
Preserve WCMHCO’s current brand, content, navigation patterns, multilingual support, booking, forms, shop, events, and backend. Improve the donation journey first, then complete a phased Google Ad Grants website-policy overhaul without inventing claims or payment functionality.

## Phase 1 — Today: Donation foundation and highest-risk compliance fixes

### Donation page and navigation
- Rename the public navigation label from **Campaigns** to **Donation** and keep it linked to the existing `/campaigns` route initially, avoiding broken links and preserving campaign management.
- Change the page presentation and metadata to **Donation**, with the heading **Make a Difference Today**, the supplied supporting text, and a **Donate Now** button that scrolls to the donation checkout on the same page.
- Replace scattered homepage and programme donation redirects with internal links to the Donation page, so donors choose a payment path within WCMHCO first.
- Preserve active campaign listings, donation totals, secure Paystack webhook tracking, offline bank details, and admin campaign editing.

### Expandable payment selector
- Add one polished, mobile-first donation area with preset ZAR amounts, custom amount, Give Once/Give Monthly selection, donor contact fields, live summary, and clear provider choice.
- **Paystack:** preserve the verified WCMHCO Paystack path. Until an inline public key or provider-supported amount-aware link is confirmed, route through the existing secure hosted checkout and clearly identify that secure handoff; do not pretend it completed on-site.
- **PayFast:** add the provider option only after the official WCMHCO PayFast payment link is supplied. Until then, do not show a non-functional payment button.
- **International Payment:** make the control expand on the same page. Test the current Donorbox URL for official iframe support; embed only if Donorbox permits it. If it is not an embeddable campaign URL, retain the existing Donorbox functionality without creating a fake checkout and flag the campaign embed code/slug needed to complete this path.
- Do not collect or store card details, CVV, passwords, or payment secrets. Do not show success based only on returning to the page.
- Show currency options and provider conversion disclosure without inventing exchange rates. Any ZAR estimate appears only when a reliable live rate source is available.
- Build accessible loading, expanded, error, and unavailable states. Payment success details appear only from a verified provider result/webhook.

### Immediate trust and policy corrections
- Remove unsupported impact numbers and unsourced percentage claims from public pages; retain only verified qualitative statements and facts already supplied by WCMHCO.
- Remove the non-functional financial/certificate document list.
- Replace the policy-summary-only experience with substantial Privacy Policy and Terms & Conditions content appropriate to the current forms, analytics, cookies, bookings, donations, and South African context. Clearly label legal review as a manual requirement.
- Correct obvious broken internal links and unfinished states found during implementation.

### Verification for Phase 1
- Check the Donation navigation, in-page scroll, amount/custom amount/frequency state, expandable international panel, Paystack handoff, and graceful unavailable state for missing PayFast details.
- Test desktop and mobile layouts and keyboard operation.
- Confirm no payment secret appears in browser code.
- Confirm the site builds and inspect runtime/console/network errors.

## Phase 2 — Next session: Mission, help, impact, governance, and content quality
- Rework the homepage opening content so first-time visitors can immediately identify WCMHCO, its verified work, who it serves, and its verified operating area.
- Add clear internal journeys for mental-health support, booking, help, volunteering, partnerships, and support.
- Expand About with verified history, mission, vision, values, structure, leadership, board, and registration details already supplied.
- Turn Mental Health into a substantial Get Help journey: eligibility, process, next steps, required information, limitations, contact options, and prominent emergency-service distinction.
- Consolidate verified programmes into substantial useful content. Create separate service pages only where enough verified material exists; do not generate thin pages.
- Create useful Impact and Governance/Transparency pages from verified content, photos, programme records, leadership, contact details, and registration data. Omit unsupported statistics and unavailable reports.
- Reframe events around charitable purpose and remove indexed “coming soon” filler where no meaningful information exists.

## Phase 3 — Final session: Whole-site quality, SEO, accessibility, and readiness report
- Audit and repair all forms, confirmations, privacy notices, labels, consent controls, error handling, and mental-health emergency notices.
- Audit every route for unique titles/descriptions, heading order, alt text, canonical URLs, crawlability, useful internal links, and non-thin content.
- Audit external links, broken buttons, empty data states, duplicate content, images, lazy loading, unnecessary scripts, and mobile/desktop layout.
- Update sitemap, robots, footer links, and navigation for final public routes.
- Test important journeys in desktop and mobile browsers, including donation selection, booking, contact, volunteer, events, navigation, and failure states.
- Produce a final compliance report that says **aligned with published requirements**, never “approved,” and separates completed changes from manual checks in Google Ads / Google for Nonprofits.

## Technical notes
- Keep the current WCMHCO semantic design tokens, `#034694` brand role, typography, imagery, i18n structure, React routes, and Lovable Cloud integrations.
- The current Paystack webhook already verifies signatures server-side and must remain authoritative.
- A generic donor-facing form must not simulate Paystack, PayFast, or Donorbox card processing.
- Donorbox iframe embedding depends on an official campaign embed URL and the provider allowing framing; no clickjacking/security bypasses.
- Monthly giving is enabled only for providers/configurations that explicitly support recurring donations.
- The current code contains inconsistent/unsupported figures (including volunteer, beneficiary, family, donor, meal, fundraising, and “success” numbers); these will be removed unless WCMHCO later provides evidence and reporting periods.

## Inputs still needed
- The official WCMHCO **PayFast payment link**.
- If the current Donorbox URL cannot be embedded, the official Donorbox **campaign embed code or campaign slug**.
- Any reports, certificates, programme evidence, or dated impact records WCMHCO wants published in later phases.
