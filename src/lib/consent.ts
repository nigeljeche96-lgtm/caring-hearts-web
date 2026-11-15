export type ConsentChoice = {
  analytics: boolean;
  advertising: boolean;
  decidedAt: string;
  version: number;
};

export const CONSENT_KEY = "wc_cookie_consent";
export const CONSENT_VERSION = 1;
export const OPEN_SETTINGS_EVENT = "wc:open-cookie-settings";

const GA_ID = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY as string | undefined;
const ADSENSE_CLIENT = "ca-pub-2805073948846762";
const GTM_ID = "GTM-M6K7CGCB";
const ADS_ID = "AW-16757792492";
/** Google Ads conversion: "Counselling booking request (website)". */
const BOOKING_CONVERSION_SEND_TO = "AW-16757792492/anNoCICdirkdEOy93rY-";

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
  }
}

export function readConsent(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentChoice;
    return parsed.version === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean, advertising: boolean): ConsentChoice {
  const choice: ConsentChoice = { analytics, advertising, decidedAt: new Date().toISOString(), version: CONSENT_VERSION };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(choice));
  applyConsent(choice);
  return choice;
}

function addScript(id: string, src: string, crossOrigin = false, prepend = false) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  if (crossOrigin) s.crossOrigin = "anonymous";
  if (prepend) document.head.insertBefore(s, document.head.firstChild);
  else document.head.appendChild(s);
}

/** Loads third-party scripts only for categories the visitor accepted. Nothing loads before a choice. */
export function applyConsent(choice: ConsentChoice | null) {
  if (!choice) return;
  if (choice.analytics || choice.advertising) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "wc_consent_update",
      consent: {
        analytics_storage: choice.analytics ? "granted" : "denied",
        ad_storage: choice.advertising ? "granted" : "denied",
        ad_user_data: choice.advertising ? "granted" : "denied",
        ad_personalization: choice.advertising ? "granted" : "denied",
      },
    });
    addScript("wc-gtm", `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`, false, true);
  }
  if (GA_ID) (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = !choice.analytics;
  // Keep Google's consent state in sync with the visitor's latest choice (also applies withdrawals).
  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: choice.analytics ? "granted" : "denied",
      ad_storage: choice.advertising ? "granted" : "denied",
      ad_user_data: choice.advertising ? "granted" : "denied",
      ad_personalization: "denied",
    });
  }
  if ((choice.analytics && GA_ID) || choice.advertising) {
    const fresh = !window.gtag;
    ensureGtag();
    if (fresh) {
      window.gtag!("consent", "default", {
        analytics_storage: choice.analytics ? "granted" : "denied",
        ad_storage: choice.advertising ? "granted" : "denied",
        ad_user_data: choice.advertising ? "granted" : "denied",
        // Health-related site: never allow ad personalisation / remarketing.
        ad_personalization: "denied",
      });
      window.gtag!("set", "developer_id.dZjgwMW", true);
    }
  }
  if (choice.analytics && GA_ID && !document.getElementById("wc-gtag")) {
    window.gtag!("config", GA_ID);
    addScript("wc-gtag", `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  }
  if (choice.advertising && !document.getElementById("wc-gtag-ads")) {
    window.gtag!("config", ADS_ID, { allow_ad_personalization_signals: false, allow_enhanced_conversions: false });
    addScript("wc-gtag-ads", `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`);
  }
  if (choice.advertising) {
    addScript("wc-adsense", `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`, true);
  }
}

/** Report a successful counselling booking request to Google Ads — only with advertising consent. */
export function reportBookingConversion() {
  const choice = readConsent();
  if (!choice?.advertising || !window.gtag) return;
  if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
  window.gtag("event", "conversion", { send_to: BOOKING_CONVERSION_SEND_TO });
}
