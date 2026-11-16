import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ExternalLink, Play, Tv, Youtube, Handshake } from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useSiteCopy } from "@/i18n/useSiteCopy";
import { tvShows, YOUTUBE_CHANNEL, type Episode, type TvShow } from "@/data/tvShows";

const thumb = (e: Episode) => e.thumbnail ?? `https://i.ytimg.com/vi/${e.youtubeId}/hqdefault.jpg`;

function Player({ episode, title }: { episode: Episode; title: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gold/40 bg-navy shadow-2xl">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${episode.youtubeId}?rel=0`}
        title={title}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}

function ShowSection({ show }: { show: TvShow }) {
  const tx = useSiteCopy();
  const [latest, ...older] = [...show.episodes].reverse();
  if (!latest) return null;
  const epLabel = `${show.title} – ${tx("Episode")} ${String(latest.number).padStart(2, "0")}`;
  return (
    <section id={show.slug} className="py-14 md:py-20 bg-background scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 max-w-3xl">
          {show.featured && (
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">{tx("Featured show")}</span>
          )}
          <h2 className="mt-3 font-heading text-3xl md:text-5xl font-bold text-foreground">{show.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{tx("Presented by")} <span className="font-semibold text-foreground">{show.presentedBy}</span></p>
          <p className="mt-4 text-lg md:text-xl font-semibold italic text-primary">{tx(show.tagline)}</p>
          <div className="mt-4 space-y-3 text-muted-foreground">
            {show.description.map((p) => <p key={p}>{tx(p)}</p>)}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-3">
            <Player episode={latest} title={`${epLabel}: ${latest.title}`} />
            <Button asChild className="mt-4">
              <a href={`https://youtu.be/${latest.youtubeId}`} target="_blank" rel="noopener noreferrer">
                <Youtube className="mr-2 h-4 w-4" /> {tx("Watch on YouTube")} <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">{tx("Latest episode")} · {epLabel}</p>
            <h3 className="mt-2 font-heading text-2xl font-bold text-foreground">{tx(latest.title)}</h3>
            {latest.publishedAt && <p className="mt-1 text-sm text-muted-foreground">{new Date(latest.publishedAt).toLocaleDateString()}</p>}
            <div className="mt-3 space-y-2 text-muted-foreground">
              {latest.intro.map((p) => <p key={p}>{tx(p)}</p>)}
            </div>
            {latest.guests.length > 0 && (
              <>
                <p className="mt-5 font-semibold text-foreground">{tx("Featuring")}</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {latest.guests.map((g) => (
                    <li key={g.name}><span className="font-medium text-foreground">{g.name}</span>{g.role ? ` – ${tx(g.role)}` : ""}</li>
                  ))}
                </ul>
              </>
            )}
            <dl className="mt-5 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-1">
              {[["Presenter", latest.presenter], ["Producer", latest.producer], ["Director", latest.director]].filter(([, v]) => v).map(([k, v]) => (
                <div key={k}><dt className="text-muted-foreground">{tx(k!)}</dt><dd className="font-medium text-foreground">{v}</dd></div>
              ))}
            </dl>
          </div>
        </div>

        {older.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-4 font-heading text-2xl font-bold text-foreground">{tx("More episodes")}</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {older.map((e) => (
                <a key={e.youtubeId} href={`https://youtu.be/${e.youtubeId}`} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-lg border border-border bg-card">
                  <div className="relative aspect-video">
                    <img src={thumb(e)} alt="" loading="lazy" className="h-full w-full object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center"><Play className="h-10 w-10 text-primary-foreground drop-shadow-lg transition-transform group-hover:scale-110" fill="currentColor" /></span>
                  </div>
                  <p className="p-3 text-sm font-semibold text-foreground">{tx("Episode")} {String(e.number).padStart(2, "0")} – {tx(e.title)}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        <Collapsible className="mt-10 rounded-xl border border-border bg-card">
          <CollapsibleTrigger className="group flex w-full items-center justify-between p-5 text-left font-heading text-xl font-bold text-foreground">
            {tx("Behind the Production")}
            <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <dl className="grid grid-cols-1 gap-4 px-5 pb-6 sm:grid-cols-2 lg:grid-cols-3">
              {show.credits.map((c) => (
                <div key={c.label}>
                  <dt className="text-xs font-bold uppercase tracking-wider text-primary">{tx(c.label)}</dt>
                  <dd className="mt-1 text-sm text-foreground">{c.people.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
}

export default function TvShows() {
  const tx = useSiteCopy();
  const featured = tvShows.find((s) => s.featured) ?? tvShows[0];
  const featuredEp = featured?.episodes[featured.episodes.length - 1];
  return (
    <>
      <SEO
        title="TV Shows & Media Productions | World Changers"
        description="Watch Gen-X Talks and other World Changers mental health programmes, interviews and conversations."
        path="/tv-shows"
      />
      <section className="relative overflow-hidden bg-navy py-16 md:py-24">
        {featuredEp && (
          <img src={thumb(featuredEp)} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover opacity-25 blur-sm scale-110" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/80 to-navy" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="container relative z-10 mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold"><Tv className="h-4 w-4" /> {tx("WCMHCO Media")}</span>
          <h1 className="mt-5 font-heading text-4xl md:text-6xl font-bold text-primary-foreground">{tx("TV Shows & Media Productions")}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90">{tx("Stories, conversations and productions that educate, inspire and create meaningful change.")}</p>
          <p className="mx-auto mt-3 max-w-2xl text-primary-foreground/70">{tx("Explore our collection of programmes, interviews and conversations dedicated to mental health awareness, community development, personal growth and social impact.")}</p>
          {featured && (
            <Button asChild size="lg" className="mt-8">
              <a href={`#${featured.slug}`}><Play className="mr-2 h-4 w-4" fill="currentColor" /> {tx("Watch")} {featured.title}</a>
            </Button>
          )}
        </motion.div>
      </section>

      {tvShows.map((s) => <ShowSection key={s.slug} show={s} />)}

      <section className="bg-primary py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground">{tx("BE PART OF THE CONVERSATION")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-primary-foreground/85">{tx("Help us create awareness, challenge misconceptions and make mental health conversations accessible to everyone.")}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary"><a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer"><Play className="mr-2 h-4 w-4" /> {tx("Watch Our Shows")}</a></Button>
            <Button asChild size="lg" variant="secondary"><a href={`${YOUTUBE_CHANNEL}?sub_confirmation=1`} target="_blank" rel="noopener noreferrer"><Youtube className="mr-2 h-4 w-4" /> {tx("Subscribe on YouTube")}</a></Button>
            <Button asChild size="lg" variant="secondary"><Link to="/partnerships"><Handshake className="mr-2 h-4 w-4" /> {tx("Partner With Us")}</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
