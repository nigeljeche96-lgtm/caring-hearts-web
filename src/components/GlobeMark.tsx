import { cn } from "@/lib/utils";

interface GlobeMarkProps {
  /** Tailwind width classes, e.g. "w-[55%] md:w-[720px]" */
  sizeClass: string;
  /** Tailwind positioning classes, e.g. "-right-24 top-1/2 -translate-y-1/2" */
  positionClass: string;
  /** Tailwind opacity classes, e.g. "opacity-[0.11] md:opacity-[0.16]" */
  opacityClass: string;
}

/** Decorative gold globe watermark for dark sections. */
const GlobeMark = ({ sizeClass, positionClass, opacityClass }: GlobeMarkProps) => (
  <div
    aria-hidden="true"
    className={cn("pointer-events-none absolute z-0 aspect-square bg-gold blur-[1.5px]", sizeClass, positionClass, opacityClass)}
    style={{
      WebkitMask: "url(/globe-white.png) center / contain no-repeat",
      mask: "url(/globe-white.png) center / contain no-repeat",
    }}
  />
);

export default GlobeMark;
