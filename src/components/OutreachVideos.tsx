import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const videos = [
  { id: "r2dQhJRn2ok", short: true },
  { id: "7DlryaT4y50", short: true },
  { id: "0qWlXLLns7w", short: true },
  { id: "3PoYrMjH2Os", short: true },
  { id: "ywb5jWeap5w", short: false },
];

export default function OutreachVideos() {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">{t("outreach.title", "Community Outreach Videos")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {videos.map(({ id, short }, index) => (
            <article key={id} className="overflow-hidden rounded-lg border border-border bg-card">
              <div className={short ? "aspect-[9/16]" : "aspect-video"}>
                {playing === id ? (
                  <iframe src={`https://www.youtube.com/embed/${id}?autoplay=1`} title={`${t("outreach.video", "Community outreach")} ${index + 1}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="w-full h-full border-0" />
                ) : (
                  <button type="button" onClick={() => setPlaying(id)} aria-label={`${t("outreach.video", "Community outreach")} ${index + 1}`} className="group relative w-full h-full bg-muted">
                    <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="w-full h-full object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110"><Play className="h-7 w-7 ml-1" fill="currentColor" /></span>
                    </span>
                  </button>
                )}
              </div>
              <div className="p-3">
                <Button asChild variant="ghost" className="w-full h-auto whitespace-normal text-primary">
                  <a href={short ? `https://youtube.com/shorts/${id}` : `https://youtu.be/${id}`} target="_blank" rel="noopener noreferrer">{t("outreach.watch", "Watch on YouTube")} <ExternalLink className="w-4 h-4 ml-2 shrink-0" /></a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}