import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Details = {
  client?: { name?: string; client_name?: string; redirect_uri?: string };
  redirect_uri?: string;
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};
type Result = { data: any; error: { message: string } | null };
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<Result>;
  approveAuthorization: (id: string) => Promise<Result>;
  denyAuthorization: (id: string) => Promise<Result>;
};
const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

const scopeLabel = (s: string) =>
  s === "openid" ? "Confirm your identity" : s === "email" ? "Share your email address" : s === "profile" ? "Share your basic profile" : `Additional permission requested: ${s}`;

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const id = params.get("authorization_id");
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [details, setDetails] = useState<Details | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!id) { setError("This connection link is invalid or has expired."); return; }
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`, { replace: true });
      return;
    }
    oauth().getAuthorizationDetails(id).then(({ data, error }) => {
      if (error) { setError(error.message || "This connection request could not be loaded."); return; }
      const redirect = data?.redirect_url ?? data?.redirect_to;
      if (redirect && !data?.client) { window.location.href = redirect; return; }
      setDetails(data);
    }).catch(() => setError("This connection request could not be loaded."));
  }, [id, user, loading, navigate]);

  const decide = async (approve: boolean) => {
    if (!id) return;
    setBusy(true);
    try {
      const { data, error } = approve ? await oauth().approveAuthorization(id) : await oauth().denyAuthorization(id);
      if (error) throw error;
      const redirect = data?.redirect_url ?? data?.redirect_to;
      if (redirect) window.location.href = redirect;
    } catch (e: any) {
      setError(e?.message || (approve ? "Approval failed. Please try again." : "Cancelling failed. Please try again."));
      setBusy(false);
    }
  };

  const clientName = details?.client?.name || details?.client?.client_name || "An external app";
  const redirectUri = details?.client?.redirect_uri || details?.redirect_uri;
  const scopes = (details?.scope || "").split(" ").filter(Boolean);

  return (
    <section className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-elevated p-6 space-y-5">
        {error ? (
          <p className="text-destructive text-sm">{error}</p>
        ) : !details ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-foreground">Connect {clientName} to World Changers</h1>
            <p className="text-sm text-muted-foreground">Signed in as <span className="font-medium text-foreground">{user?.email}</span></p>
            {redirectUri && <p className="text-xs text-muted-foreground break-all">Returns to: {redirectUri}</p>}
            <p className="text-sm text-foreground">{clientName} will be able to call this app's enabled tools while you are signed in.</p>
            {scopes.length > 0 && (
              <ul className="text-sm list-disc pl-5 text-foreground">{scopes.map((s) => <li key={s}>{scopeLabel(s)}</li>)}</ul>
            )}
            <p className="text-xs text-muted-foreground">This does not bypass this app's permissions or backend policies.</p>
            <div className="flex gap-2">
              <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>Approve</Button>
              <Button variant="outline" className="flex-1" disabled={busy} onClick={() => decide(false)}>Cancel connection</Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default OAuthConsent;
