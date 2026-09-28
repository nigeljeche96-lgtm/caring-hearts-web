import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Loader2, HeartHandshake } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "wcmhco-support-chat";

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hi, I'm **Nelly**, the World Changers help assistant. I can help with booking a free counselling session, donating, volunteering, events or anything else about our work. How can I help you today?",
};

const SUGGESTIONS = [
  "How do I book a free counselling session?",
  "How can I donate or partner with you?",
  "I'd like to volunteer",
  "What events are coming up?",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chat`;

const loadMessages = (): ChatMessage[] => {
  if (typeof window === "undefined") return [WELCOME];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as ChatMessage[];
  } catch {
    /* ignore */
  }
  return [WELCOME];
};

const SupportChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      /* ignore */
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    setInput("");
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next.filter((m) => m !== WELCOME) }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Sorry, I couldn't respond just now.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages([...next, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistant += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: assistant }]);
      }

      if (!assistant.trim()) {
        setMessages(next);
        setError("I couldn't answer that one. Please email info@worldchangersmh.org.");
      }
    } catch (err) {
      setMessages(next);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-[60] flex h-[min(78vh,620px)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevated sm:bottom-6 sm:right-6"
          >
            <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
                <HeartHandshake className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-sm font-semibold leading-tight">Nelly — Help Assistant</p>
                <p className="text-xs text-primary-foreground/80">World Changers MHCO</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1.5 transition-colors hover:bg-primary-foreground/15"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-background px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground"
                        : "max-w-[92%] rounded-2xl rounded-bl-sm bg-secondary px-3.5 py-2.5 text-sm text-foreground"
                    }
                  >
                    {m.role === "assistant" ? (
                      <div className="space-y-2 leading-relaxed [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_li]:ml-4 [&_li]:list-disc [&_strong]:font-semibold">
                        <ReactMarkdown
                          components={{
                            a: ({ href, children }) =>
                              href?.startsWith("/") ? (
                                <Link to={href} onClick={() => setOpen(false)}>
                                  {children}
                                </Link>
                              ) : (
                                <a href={href} target="_blank" rel="noopener noreferrer">
                                  {children}
                                </a>
                              ),
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}

              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-secondary px-3.5 py-2.5 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Typing…
                  </div>
                </div>
              )}

              {error && (
                <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
              )}

              {messages.length <= 1 && !loading && (
                <div className="space-y-2 pt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full rounded-xl border border-border bg-card px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2 border-t border-border bg-card px-3 py-3"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Ask us anything…"
                aria-label="Type your message"
                className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()} className="h-[42px] w-[42px] shrink-0 rounded-xl" aria-label="Send message">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open help chat"
          className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-elevated transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Need help?</span>
        </button>
      )}
    </>
  );
};

export default SupportChat;
