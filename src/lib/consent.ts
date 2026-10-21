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

function addScript(id: string, src: string, crossOrigin = false) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  if (crossOrigin) s.crossOrigin = "anonymous";
  document.head.appendChild(s);
}

/** Loads third-party scripts only for categories the visitor accepted. Nothing loads before a choice. */
export function applyConsent(choice: ConsentChoice | null) {
  if (!choice) return;
  if (GA_ID) (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = !choice.analytics;
  if (choice.analytics && GA_ID) {
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", GA_ID);
    }
    addScript("wc-gtag", `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  }
  if (choice.advertising) {
    addScript("wc-adsense", `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`, true);
  }
}
