import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

type Clip = { id: string; short: boolean };

/** Short vertical clips shown in the top row. */
const shortClips: Clip[] = [
  { id: "r2dQhJRn2ok", short: true },
  { id: "7DlryaT4y50", short: true },
  { id: "0qWlXLLns7w", short: true },
  { id: "3PoYrMjH2Os", short: true },
];

/** Full-length videos shown underneath the shorts. */
const longClips: Clip[] = [
  { id: "ywb5jWeap5w", short: false },
  { id: "ZgfcN2DHrz0", short: false },
  { id: "MkCq-scDGqM", short: false },
];

export default function OutreachVideos() {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState<string | null>(null);

  const label = (index: number) => `${t("outreach.video", "Community outreach")} ${index}`;

  const clipCard = (clip: Clip, index: number) => (
    <article key={clip.id} className="overflow-hidden rounded-lg border border-border bg-card">
      <div className={clip.short ? "aspect-[9/16]" : "aspect-video"}>
        {playing === clip.id ? (
          <iframe
            src={`https://www.youtube.com/embed/${clip.id}?autoplay=1`}
            title={label(index)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(clip.id)} aria-label={label(index)} className="group relative w-full h-full bg-muted">
            <img src={`https://i.ytimg.com/vi/${clip.id}/hqdefault.jpg`} alt="" loading="lazy" className="w-full h-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
                <Play className="h-7 w-7 ml-1" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-3">
        <Button asChild variant="ghost" className="w-full h-auto whitespace-normal text-primary px-1.5 text-xs sm:px-4 sm:text-sm">
          <a
            href={clip.short ? `https://youtube.com/shorts/${clip.id}` : `https://youtu.be/${clip.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("outreach.watch", "Watch on YouTube")} <ExternalLink className="w-4 h-4 ml-2 shrink-0" />
          </a>
        </Button>
      </div>
    </article>
  );

  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
          {t("outreach.title", "Community Outreach Videos")}
        </h2>
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">{shortClips.map((clip, i) => clipCard(clip, i + 1))}</div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {longClips.map((clip, i) => clipCard(clip, shortClips.length + i + 1))}
          </div>
        </div>
      </div>
    </section>
  );
}
