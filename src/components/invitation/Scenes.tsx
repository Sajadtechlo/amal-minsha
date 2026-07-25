import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { invitation } from "./data";
import { Reveal } from "./Reveal";
import { Divider, GeometricStar, Leaf } from "./Ornaments";
import { Petals } from "./Petals";
import gardenDawn from "@/assets/garden-dawn.jpg";
import floralSpray from "@/assets/floral-spray.png";

const EASE = [0.22, 0.61, 0.36, 1] as const;


/* Scene 2 — the verse, arriving out of the dark and dissolving into light. */
export function VerseScene({ active = false }: { active?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [hint, setHint] = useState(false);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let userMoved = false;

    const markMoved = () => {
      userMoved = true;
      setHint(false);
    };

    window.addEventListener("wheel", markMoved, { passive: true });
    window.addEventListener("touchmove", markMoved, { passive: true });
    window.addEventListener("scroll", markMoved, { passive: true });
    window.addEventListener("keydown", markMoved);

    // Soft “scroll” cue appears after the verse settles.
    const hintTimer = window.setTimeout(() => {
      if (!cancelled && !userMoved && window.scrollY < 24) setHint(true);
    }, 2800);

    // If the guest still hasn’t scrolled, gently continue the story.
    const scrollTimer = window.setTimeout(() => {
      if (cancelled || userMoved || reduce) return;
      if (window.scrollY > 40) return;

      const next = sectionRef.current?.nextElementSibling as HTMLElement | null;
      if (next) {
        next.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollBy({ top: Math.round(window.innerHeight * 0.9), behavior: "smooth" });
      }
      setHint(false);
    }, 4800);

    return () => {
      cancelled = true;
      window.clearTimeout(hintTimer);
      window.clearTimeout(scrollTimer);
      window.removeEventListener("wheel", markMoved);
      window.removeEventListener("touchmove", markMoved);
      window.removeEventListener("scroll", markMoved);
      window.removeEventListener("keydown", markMoved);
    };
  }, [active, reduce]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6"
      style={{ background: "var(--gradient-night)" }}
      aria-labelledby="verse-title"
    >
      <Petals count={18} tone="light" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ivory" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal>
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-2xl leading-[2.4] text-champagne sm:text-4xl"
          >
            {invitation.verse.arabic}
          </p>
        </Reveal>
        <Reveal delay={0.8} className="mt-12">
          <h2
            id="verse-title"
            className="font-display text-xl font-light italic leading-relaxed text-moonstone/90 sm:text-2xl"
          >
            “{invitation.verse.english}”
          </h2>
        </Reveal>
        <Reveal delay={1.4} className="mt-8">
          <p className="eyebrow text-[color:color-mix(in_oklab,var(--champagne)_80%,white)]">
            {invitation.verse.reference}
          </p>
        </Reveal>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex flex-col items-center gap-2"
        initial={false}
        animate={{ opacity: hint ? 1 : 0, y: hint ? 0 : 8 }}
        transition={{ duration: 1.1, ease: EASE }}
        aria-hidden={!hint}
      >
        <p className="eyebrow text-[color:color-mix(in_oklab,var(--champagne)_75%,white)]">
          scroll to continue
        </p>
        <span className="flex h-8 w-8 items-center justify-center text-champagne/80">
          <svg viewBox="0 0 24 24" className="h-4 w-4 animate-breathe" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </motion.div>
    </section>
  );
}

/* Scene 3 lives in DoorwayScene.tsx — gates of heaven. */

/* Scene 4 — the dreamlike garden the guest walks into. */
export function GardenScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden"
      aria-label="A garden at dawn"
    >
      <motion.img
        src={gardenDawn}
        alt="A misty garden at dawn with olive trees reflected in still water"
        width={1536}
        height={1024}
        loading="lazy"
        style={{ y }}
        className="absolute inset-0 h-[116%] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ivory/70 via-ivory/10 to-ivory" />
      <Petals count={16} tone="rose" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[18, 42, 66].map((left, i) => (
          <span
            key={left}
            className="absolute top-[-20%] h-[140%] w-[14vw] rotate-12 bg-gradient-to-b from-champagne/25 to-transparent blur-2xl"
            style={{ left: `${left}%`, animation: `shimmer ${9 + i * 3}s ease-in-out infinite` }}
          />
        ))}
      </div>
      <div className="relative z-10 flex min-h-[100svh] items-end justify-center pb-24">
        <Reveal>
          <p className="eyebrow text-center">two paths, written long before</p>
        </Reveal>
      </div>
    </section>
  );
}

/* Scene 5 — two streams of light travel, meet, and the world blossoms into names. */
export function SoulsScene() {
  const reduce = useReducedMotion();
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (d: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { duration: reduce ? 0.3 : 4.2, delay: d, ease: EASE },
    }),
  };

  return (
    <section
      className="relative overflow-hidden bg-ivory px-6 py-24"
      aria-labelledby="names-title"
    >
      <img
        src={floralSpray}
        alt=""
        aria-hidden="true"
        width={1024}
        height={1536}
        loading="lazy"
        className="pointer-events-none absolute -left-24 top-10 w-64 opacity-45 sm:w-80"
      />
      <img
        src={floralSpray}
        alt=""
        aria-hidden="true"
        width={1024}
        height={1536}
        loading="lazy"
        className="pointer-events-none absolute -right-24 bottom-0 w-64 -scale-x-100 opacity-40 sm:w-80"
      />

      <div className="relative mx-auto max-w-3xl">
        <motion.svg
          viewBox="0 0 400 200"
          className="mx-auto w-full max-w-xl text-champagne"
          fill="none"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          aria-hidden="true"
        >
          <motion.path
            d="M4 30 C 90 30, 120 96, 200 100"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            variants={draw}
            custom={0}
          />
          <motion.path
            d="M396 170 C 310 170, 280 104, 200 100"
            stroke="color-mix(in oklab, var(--rose) 70%, white)"
            strokeWidth="1.2"
            strokeLinecap="round"
            variants={draw}
            custom={0.4}
          />
          <motion.circle
            cx="200"
            cy="100"
            r="5"
            fill="currentColor"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 4 }}
          />
          <motion.circle
            cx="200"
            cy="100"
            r="26"
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ opacity: 0, scale: 0.2 }}
            whileInView={{ opacity: [0, 0.9, 0], scale: 2.6 }}
            viewport={{ once: true }}
            transition={{ duration: 4, delay: 4.2 }}
          />
        </motion.svg>

        <Reveal delay={0.4} className="mt-10 text-center">
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
            {invitation.intro}
          </p>
        </Reveal>

        <div className="mt-14 text-center">
          <Reveal delay={0.6}>
            <h1
              id="names-title"
              className="font-script text-6xl leading-none text-ink sm:text-8xl"
            >
              {invitation.groom}
            </h1>
          </Reveal>
          <Reveal delay={0.9}>
            <p className="my-4 font-display text-2xl tracking-[0.3em] text-sandstone sm:text-3xl">
              and
            </p>
          </Reveal>
          <Reveal delay={1.1}>
            <p className="font-script text-6xl leading-none text-ink sm:text-8xl">
              {invitation.bride}
            </p>
          </Reveal>
          <Reveal delay={1.4}>
            <Divider className="mt-12" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Scenes 6–8 — the announcement, the families, and the details on paper panels. */
export function AnnouncementScene() {
  const details = [
    { label: "Day", value: invitation.dayName },
    { label: "Date", value: `${invitation.monthName} ${invitation.day}, ${invitation.year}` },
    { label: "Time", value: invitation.time },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-24" aria-labelledby="details-title">
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <p className="eyebrow">the nikah ceremony</p>
          <h2 id="details-title" className="mt-4 font-display text-3xl text-ink sm:text-4xl">
            You are warmly invited
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            With the blessings of our families, we would be honoured by your presence and your
            dua as we begin this life together.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {details.map((d, i) => (
            <Reveal key={d.label} delay={0.15 * i}>
              <article className="paper relative h-full rounded-sm px-6 py-10 text-center">
                <span className="pointer-events-none absolute inset-3 border border-champagne/25" />
                <p className="eyebrow">{d.label}</p>
                <p className="mt-4 font-display text-2xl text-ink">{d.value}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-6">
          <article className="paper relative overflow-hidden rounded-sm px-6 py-12 text-center">
            <span className="pointer-events-none absolute inset-3 border border-champagne/25" />
            <Leaf className="absolute -left-2 top-4 h-16 w-16 text-sage/30" />
            <Leaf className="absolute -right-2 bottom-4 h-16 w-16 -scale-x-100 text-eucalyptus/30" />
            <p className="eyebrow">Reception & Venue</p>
            <p className="mt-5 font-display text-2xl leading-snug text-ink sm:text-3xl">
              {invitation.venue}
            </p>
            <p className="mt-2 text-sm tracking-[0.2em] uppercase text-muted-foreground">
              {invitation.city}
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Lunch will be served following the ceremony
            </p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

/* Scene 10 — the journey to the venue as a path of light, then the map. */
export function VenueScene() {
  const [showMap, setShowMap] = useState(false);
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(invitation.mapQuery)}&output=embed`;

  return (
    <section className="relative overflow-hidden bg-secondary/50 px-6 py-28" aria-labelledby="venue-title">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="eyebrow">the journey</p>
          <h2 id="venue-title" className="mt-4 font-display text-3xl text-ink sm:text-4xl">
            Finding your way to us
          </h2>
        </Reveal>

        <Reveal delay={0.2} className="mt-12">
          <motion.svg
            viewBox="0 0 400 120"
            className="mx-auto w-full max-w-lg text-olivegold"
            fill="none"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            aria-hidden="true"
          >
            <motion.path
              d="M12 100 C 80 100, 90 24, 160 40 S 280 108, 388 26"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeDasharray="1 6"
              variants={{
                hidden: { pathLength: 0 },
                show: { pathLength: 1, transition: { duration: 3.6, ease: EASE } },
              }}
            />
            <circle cx="12" cy="100" r="3.5" fill="currentColor" opacity="0.6" />
            <g className="animate-breathe">
              <circle cx="388" cy="26" r="5" fill="currentColor" />
            </g>
          </motion.svg>
        </Reveal>

        <Reveal delay={0.3} className="mt-10">
          <p className="font-display text-2xl text-ink">{invitation.venue}</p>
          <p className="mt-2 text-sm tracking-[0.2em] uppercase text-muted-foreground">
            {invitation.city}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.mapQuery)}`}
              target="_blank"
              rel="noreferrer"
              className="border border-champagne/60 px-7 py-3 text-xs uppercase tracking-[0.28em] text-ink transition-colors duration-500 hover:bg-champagne/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Open in Maps
            </a>
            <button
              type="button"
              onClick={() => setShowMap((v) => !v)}
              className="text-xs uppercase tracking-[0.28em] text-muted-foreground underline-offset-8 transition-colors hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showMap ? "Hide map" : "Show map"}
            </button>
          </div>
        </Reveal>

        {showMap && (
          <Reveal className="mt-10">
            <div className="paper overflow-hidden rounded-sm p-2">
              <iframe
                title={`Map to ${invitation.venue}`}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[320px] w-full border-0 grayscale-[35%]"
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* Scene 12 — the closing blessing. */
export function BlessingScene() {
  return (
    <section
      className="relative flex min-h-[90svh] items-center justify-center overflow-hidden px-6 py-28"
      aria-labelledby="blessing-title"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 40%, color-mix(in oklab, var(--champagne) 30%, transparent), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <Petals count={12} tone="gold" />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Reveal>
          <GeometricStar className="mx-auto h-24 w-24 animate-breathe text-champagne" />
        </Reveal>
        <Reveal delay={0.3} className="mt-10">
          <p
            id="blessing-title"
            dir="rtl"
            lang="ar"
            className="font-arabic text-2xl leading-[2.2] text-ink sm:text-3xl"
          >
            {invitation.barakah}
          </p>
        </Reveal>
        <Reveal delay={0.6} className="mt-8">
          <p className="font-display text-lg italic leading-relaxed text-muted-foreground">
            {invitation.barakahEnglish}
          </p>
        </Reveal>
        <Reveal delay={0.9} className="mt-14">
          <Divider />
          <p className="mt-10 font-script text-4xl text-ink sm:text-5xl">
            {invitation.groom} &amp; {invitation.bride}
          </p>
          <p className="eyebrow mt-6">
            {invitation.dayName} · {invitation.monthName} {invitation.day}, {invitation.year}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
