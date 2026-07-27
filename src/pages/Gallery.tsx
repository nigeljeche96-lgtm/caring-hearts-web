import { useState } from "react";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import philanthropyBg from "@/assets/philanthropy-bg.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.png";
import gallery8 from "@/assets/gallery-8.jpg";
import gallery9 from "@/assets/gallery-9.jpg";
import gallery10 from "@/assets/gallery-10.jpg";
import gallery11 from "@/assets/gallery-11.jpg";
import gallery12 from "@/assets/gallery-12.jpg";
import gallery13 from "@/assets/gallery-13.jpg";
import gallery14 from "@/assets/gallery-14.jpg";
import gallery15 from "@/assets/gallery-15.jpg";
import gallery16 from "@/assets/gallery-16.jpg";
import gallery17 from "@/assets/gallery-17.jpg";
import gallery18 from "@/assets/gallery-18.jpg";
import gallery19 from "@/assets/gallery-19.jpg";
import gallery20 from "@/assets/gallery-20.jpg";
import gallery21 from "@/assets/gallery-21.jpg";
import gallery22 from "@/assets/gallery-22.jpg";
import gallery23 from "@/assets/gallery-23.jpg";
import gallery24 from "@/assets/gallery-24.jpg";
import gallery25 from "@/assets/gallery-25.jpg";
import gallery26 from "@/assets/gallery-26.jpg";
import gallery27 from "@/assets/gallery-27.jpg";
import gallery28 from "@/assets/gallery-28.jpg";
import gallery29 from "@/assets/gallery-29.jpg";
import gallery30 from "@/assets/gallery-30.jpg";
import gallery31 from "@/assets/gallery-31.jpg";

import gallery33 from "@/assets/gallery-33.jpg";
import gallery34 from "@/assets/gallery-34.jpg";
import gallery35 from "@/assets/gallery-35.jpg";
import gallery36 from "@/assets/gallery-36.jpg";
import gallery38 from "@/assets/gallery-38.jpg";
import gallery39 from "@/assets/gallery-39.jpg";
import gallery40 from "@/assets/gallery-40.jpg";
import gallery41 from "@/assets/gallery-41.jpg";
import gallery42 from "@/assets/gallery-42.jpg";
import gallery43 from "@/assets/gallery-43.jpg";
import gallery44 from "@/assets/gallery-44.jpg";
import gallery45 from "@/assets/gallery-45.jpg";
import gallery46 from "@/assets/gallery-46.jpg";
import gallery47 from "@/assets/gallery-47.jpg";
import gallery48 from "@/assets/gallery-48.jpg";
import gallery49 from "@/assets/gallery-49.jpg";
import gallery50 from "@/assets/gallery-50.jpg";
import gallery51 from "@/assets/gallery-51.jpg";
import gallery52 from "@/assets/gallery-52.jpg";
import img7181 from "@/assets/img_7181.jpg.asset.json";
import img7194 from "@/assets/img_7194.jpg.asset.json";
import img7195 from "@/assets/img_7195.jpg.asset.json";
import img7196 from "@/assets/img_7196.jpg.asset.json";
import img7207 from "@/assets/img_7207.jpg.asset.json";
import img9859 from "@/assets/img_9859.jpg.asset.json";
import img9868 from "@/assets/img_9868.jpg.asset.json";
import img9882 from "@/assets/img_9882.jpg.asset.json";
import img9889 from "@/assets/img_9889.jpg.asset.json";
import img9908 from "@/assets/img_9908.jpg.asset.json";
import img9938 from "@/assets/img_9938.jpg.asset.json";
import outreachBooks1 from "@/assets/outreach_books1.jpg.asset.json";
import outreachHygiene from "@/assets/outreach_hygiene.jpg.asset.json";
import outreachStationery from "@/assets/outreach_stationery.jpg.asset.json";
import outreachCommunity from "@/assets/outreach_community.jpg.asset.json";
import outreachPartners from "@/assets/outreach_partners.jpg.asset.json";

const images = [
  { src: outreachBooks1.url, alt: "Mental Health Matters school books distribution" },
  { src: outreachStationery.url, alt: "Community stationery drive with volunteers" },
  { src: outreachHygiene.url, alt: "Hygiene pack distribution outreach" },
  { src: outreachCommunity.url, alt: "Community members at outreach event with SAPS" },
  { src: outreachPartners.url, alt: "Daniel Project partners at mobile clinic outreach" },
  { src: img9859.url, alt: "The Daniel Project community outreach event" },
  { src: img9868.url, alt: "Community wellness outreach with mobile clinic" },
  { src: img9882.url, alt: "Community mental health outreach" },
  { src: img9889.url, alt: "Community outreach gathering" },
  { src: img9908.url, alt: "Mobile clinic community outreach" },
  { src: img9938.url, alt: "Community health awareness event" },
  { src: img7181.url, alt: "Community kitchen outreach" },
  { src: img7195.url, alt: "Community food distribution outreach" },
  { src: img7194.url, alt: "Volunteers on community outreach" },
  { src: img7196.url, alt: "Community outreach in partnership" },
  { src: img7207.url, alt: "Volunteer at outreach event" },
  { src: gallery1, alt: "Men's Day Summit audience" },
  { src: gallery2, alt: "Volunteer registration" },
  { src: gallery3, alt: "EmpowaMen Speaker badge" },
  { src: gallery4, alt: "Depression and Mental Health panel" },
  { src: gallery5, alt: "Metro FM speaker session" },
  { src: gallery6, alt: "World Changers speaker" },
  { src: gallery7, alt: "Panel discussion on stage" },
  { src: gallery8, alt: "Community event audience" },
  { src: gallery9, alt: "Event attendees" },
  { src: gallery10, alt: "Youth at community event" },
  { src: gallery11, alt: "Guest speaker presentation" },
  { src: gallery12, alt: "Audience engagement" },
  { src: gallery13, alt: "Speaker addressing crowd" },
  { src: gallery14, alt: "Event attendees seated" },
  { src: gallery15, alt: "Community members at venue" },
  { src: gallery16, alt: "Youth audience" },
  { src: gallery17, alt: "Attendees at summit" },
  { src: gallery18, alt: "Community gathering" },
  { src: gallery19, alt: "Discussion session" },
  { src: gallery20, alt: "Crowd participation" },
  { src: gallery21, alt: "Golf Day team photo" },
  { src: gallery22, alt: "Mental Health Awareness Golf Day" },
  { src: gallery23, alt: "Golf Day ladies team" },
  { src: gallery24, alt: "Golfers on the course" },
  { src: gallery25, alt: "Golf Day at Lavo Wines" },
  { src: gallery26, alt: "Golf Day backdrop" },
  { src: gallery27, alt: "Golfers with umbrellas" },
  { src: gallery28, alt: "Community food distribution" },
  { src: gallery29, alt: "Humanitarian aid drive" },
  { src: gallery30, alt: "Community outreach event" },
  { src: gallery31, alt: "Community volunteer event" },
  
  { src: gallery33, alt: "Team collaboration" },
  { src: gallery34, alt: "Outreach program" },
  { src: gallery35, alt: "Mental health awareness event" },
  { src: gallery36, alt: "Community support gathering" },
  { src: gallery38, alt: "Community workshop" },
  { src: gallery39, alt: "Youth engagement program" },
  { src: gallery40, alt: "Impact initiative" },
  { src: gallery41, alt: "Community outreach program" },
  { src: gallery42, alt: "Volunteer event" },
  { src: gallery43, alt: "World Changers team group photo" },
  { src: gallery44, alt: "Community event auditorium" },
  { src: gallery45, alt: "Youth workshop session" },
  { src: gallery46, alt: "Community awareness event" },
  { src: gallery47, alt: "Audience at community event" },
  { src: gallery48, alt: "Community outreach gathering" },
  { src: gallery49, alt: "Event venue audience" },
  { src: gallery50, alt: "Volunteer outreach team" },
  { src: gallery51, alt: "Community hall event" },
  { src: gallery52, alt: "Youth engagement session" },
];

const Gallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
  const next = () => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));

  return (
    <div>

      <SEO title="Photo Gallery — World Changers MHCO" description="Photos from our programs, outreach campaigns, events and community wellness initiatives across Southern Africa." path="/gallery" />
      <PageHero title="Gallery" subtitle="Moments that capture our impact" bgImage={philanthropyBg} />
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading label="Visual Impact" title="Our Work in Pictures" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 8) * 0.04, duration: 0.4 }}
                className="rounded-xl overflow-hidden shadow-soft border border-border aspect-square cursor-pointer group"
                onClick={() => openLightbox(i)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}>
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/80 hover:text-white z-10"><X className="w-8 h-8" /></button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white/80 hover:text-white z-10"><ChevronLeft className="w-10 h-10" /></button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white/80 hover:text-white z-10"><ChevronRight className="w-10 h-10" /></button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="absolute bottom-6 text-white/90 text-sm">{images[lightboxIndex].alt} • {lightboxIndex + 1}/{images.length}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
