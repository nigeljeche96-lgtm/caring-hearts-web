import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import { applyConsent, readConsent, saveConsent, OPEN_SETTINGS_EVENT, CONSENT_KEY } from "@/lib/consent";

const CookieConsent = () => {
  const tx = useSiteCopy();
  const [open, setOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (existing) applyConsent(existing);
    else setOpen(true);

    const openSettings = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? false);
      setAdvertising(c?.advertising ?? false);
      setCustomize(true);
      setOpen(true);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY) window.location.reload();
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const decide = (a: boolean, ad: boolean) => {
    const prev = readConsent();
    saveConsent(a, ad);
    setOpen(false);
    setCustomize(false);
    // Already-loaded scripts can only be fully removed with a reload.
    if (prev && ((prev.analytics && !a) || (prev.advertising && !ad))) window.location.reload();
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label={tx("Cookie preferences")}
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-[60] rounded-xl border border-border bg-card text-card-foreground shadow-2xl p-5"
    >
      <h2 className="font-heading text-lg font-semibold mb-2">{tx("We value your privacy")}</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {tx("We use essential cookies to run this site. With your permission, we also use Google Analytics to understand visits and Google AdSense to show ads. Nothing optional loads until you choose.")}{" "}
        <Link to="/policies#privacy" className="underline text-primary">{tx("Privacy Policy")}</Link>
      </p>

      {customize && (
        <div className="space-y-3 mb-4 border-t border-border pt-3">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-sm font-medium">{tx("Essential")}</p><p className="text-xs text-muted-foreground">{tx("Required for the site to work.")}</p></div>
            <Switch checked disabled aria-label={tx("Essential")} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-sm font-medium">{tx("Analytics")}</p><p className="text-xs text-muted-foreground">{tx("Google Analytics visit statistics.")}</p></div>
            <Switch checked={analytics} onCheckedChange={setAnalytics} aria-label={tx("Analytics")} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-sm font-medium">{tx("Advertising")}</p><p className="text-xs text-muted-foreground">{tx("Google AdSense ads and personalisation.")}</p></div>
            <Switch checked={advertising} onCheckedChange={setAdvertising} aria-label={tx("Advertising")} />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {customize ? (
          <Button size="sm" className="flex-1" onClick={() => decide(analytics, advertising)}>{tx("Save choices")}</Button>
        ) : (
          <Button size="sm" variant="outline" className="flex-1" onClick={() => setCustomize(true)}>{tx("Customise")}</Button>
        )}
        <Button size="sm" variant="outline" className="flex-1" onClick={() => decide(false, false)}>{tx("Reject all")}</Button>
        <Button size="sm" className="flex-1" onClick={() => decide(true, true)}>{tx("Accept all")}</Button>
      </div>
    </div>
  );
};

export default CookieConsent;
