import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type State = "loading" | "valid" | "invalid" | "done" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<State>("loading");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`;
    fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } })
      .then((res) => setState(res.ok ? "valid" : "invalid"))
      .catch(() => setState("error"));
  }, [token]);

  const confirm = async () => {
    setSubmitting(true);
    const { error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    setSubmitting(false);
    setState(error ? "error" : "done");
  };

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center bg-card border rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-primary mb-4">Email preferences</h1>
        {state === "loading" && <p className="text-muted-foreground">Checking your link…</p>}
        {state === "valid" && (
          <>
            <p className="text-muted-foreground mb-6">
              Click below to stop receiving emails from World Changers Mental Health Care Organisation.
            </p>
            <Button onClick={confirm} disabled={submitting} className="w-full">
              {submitting ? "Unsubscribing…" : "Confirm unsubscribe"}
            </Button>
          </>
        )}
        {state === "done" && (
          <p className="text-muted-foreground">You have been unsubscribed. We're sorry to see you go.</p>
        )}
        {state === "invalid" && (
          <p className="text-muted-foreground">This unsubscribe link is invalid or has already been used.</p>
        )}
        {state === "error" && (
          <p className="text-muted-foreground">Something went wrong. Please try again later.</p>
        )}
      </div>
    </main>
  );
};

export default Unsubscribe;
