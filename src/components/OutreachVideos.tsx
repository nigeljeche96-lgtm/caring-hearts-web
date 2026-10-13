import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const videos = ["r2dQhJRn2ok", "7DlryaT4y50", "0qWlXLLns7w"];

export default function OutreachVideos() {
  const { t } = useTranslation();
  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">{t("outreach.title", "Community Outreach Videos")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {videos.map((id, index) => (
            <article key={id} className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="aspect-[9/16]">
                <iframe src={`https://www.youtube.com/embed/${id}`} title={`${t("outreach.video", "Community outreach")} ${index + 1}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="w-full h-full border-0" />
              </div>
              <div className="p-3">
                <Button asChild variant="ghost" className="w-full h-auto whitespace-normal text-primary">
                  <a href={`https://youtube.com/shorts/${id}`} target="_blank" rel="noopener noreferrer">{t("outreach.watch", "Watch on YouTube")} <ExternalLink className="w-4 h-4 ml-2 shrink-0" /></a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}