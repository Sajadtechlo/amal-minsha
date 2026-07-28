import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GeometricStar } from "./Ornaments";
import { invitation } from "./data";
import gardenDawn from "@/assets/garden-dawn.jpg";
import ringsUnion from "@/assets/35575-407595493.mp4";

const EASE = [0.22, 0.61, 0.36, 1] as const;

type GatePhase = "closed" | "opening" | "rings" | "names" | "ready";

/**
 * Scene 3 — The gates of heaven.
 * Touch opens the doors → rings video (mobile-full) → fade to names → then scroll unlocks.
 */
export function DoorwayScene({ onReady }: { onReady?: () => void }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<GatePhase>("closed");
  const [inView, setInView] = useState(false);
  const opened = phase !== "closed";
  const ritualActive = inView && phase !== "ready";

  const openDoors = useCallback(() => {
    if (phase !== "closed") return;
    setPhase("opening");
    // Begin the rings as the doors start to part — one continuous moment.
    window.setTimeout(
      () => setPhase("rings"),
      reduce ? 200 : 700,
    );
  }, [phase, reduce]);

  useEffect(() => {
    if (phase !== "opening" && phase !== "rings") return;
    const video = videoRef.current;
    if (!video) return;
    if (phase === "opening") {
      video.currentTime = 0;
      void video.play().catch(() => {});
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "names") return;
    videoRef.current?.pause();
  }, [phase]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.45),
      { threshold: [0.45, 0.7] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Lock scrolling during the gate ritual; unlock only after names have arrived.
  useEffect(() => {
    if (!ritualActive) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ritualActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => setPhase("names");
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, []);

  useEffect(() => {
    if (phase !== "rings") return;
    const fallback = window.setTimeout(() => setPhase("names"), 10000);
    return () => window.clearTimeout(fallback);
  }, [phase]);

  // After names finish their entrance, unlock the rest of the invitation.
  useEffect(() => {
    if (phase !== "names") return;
    const t = window.setTimeout(
      () => {
        setPhase("ready");
        onReady?.();
      },
      reduce ? 900 : 4200,
    );
    return () => window.clearTimeout(t);
  }, [phase, onReady, reduce]);

  const motes = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: (i * 53) % 100,
        top: ((i * 37) % 90) + 4,
        size: 1.5 + (i % 4),
        delay: (i % 9) * 0.35,
      })),
    [],
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      aria-label="The gates of heaven"
      style={{
        background:
          "radial-gradient(100% 70% at 50% 28%, color-mix(in oklab, var(--moonstone) 75%, white), transparent 58%), radial-gradient(90% 65% at 50% 78%, color-mix(in oklab, var(--blush) 40%, transparent), transparent 62%), #f4efe4",
      }}
    >
      {/* Soft garden atmosphere */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: phase === "names" || phase === "ready" ? 0.55 : phase === "rings" ? 0.2 : 0.12,
        }}
        transition={{ duration: 2.2, ease: EASE }}
      >
        <img
          src={gardenDawn}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,color-mix(in_oklab,white_55%,transparent),color-mix(in_oklab,#f4efe4_82%,transparent)_80%)]" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {motes.map((m) => (
          <span
            key={m.id}
            className="absolute rounded-full bg-champagne"
            style={{
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
              opacity: phase === "names" || phase === "ready" ? 0.2 : opened ? 0.5 : 0.28,
              boxShadow: "0 0 14px color-mix(in oklab, var(--champagne) 75%, white)",
              animation: reduce
                ? undefined
                : `heaven-mote ${8 + (m.id % 6)}s ease-in-out ${m.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Closed-gate title */}
      <motion.div
        className="relative z-30 px-5 pt-[max(1.1rem,env(safe-area-inset-top))] text-center sm:pt-9"
        animate={{ opacity: phase === "closed" ? 1 : 0, y: phase === "closed" ? 0 : -14 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <p className="eyebrow text-ink/55">the gates of heaven</p>
        <p className="mt-3 font-display text-[1.35rem] font-light text-ink/75 sm:text-3xl">
          A door opens where mercy dwells
        </p>
      </motion.div>

      {/* Door stage — video lives inside the gate, not as a separate screen */}
      <motion.div
        className="relative z-20 mx-auto flex w-full max-w-[42rem] flex-1 items-center justify-center px-0 sm:px-4"
        style={{ perspective: reduce ? undefined : "1400px", perspectiveOrigin: "50% 55%" }}
        animate={{
          opacity: phase === "names" || phase === "ready" ? 0 : 1,
          scale: phase === "names" || phase === "ready" ? 1.04 : 1,
          filter: phase === "names" || phase === "ready" ? "blur(12px)" : "blur(0px)",
        }}
        transition={{ duration: reduce ? 0.5 : 2.8, ease: EASE }}
        aria-hidden={phase === "names" || phase === "ready"}
      >
        <div
          className="relative flex h-[min(78svh,44rem)] w-full max-w-[100vw] items-end justify-center sm:h-[min(82svh,46rem)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Heavenly bloom behind the opening */}
          <motion.div
            className="absolute bottom-[4%] left-1/2 z-0 h-[78%] w-[78%] -translate-x-1/2 rounded-t-full sm:w-[62%]"
            animate={{ opacity: opened ? 1 : 0.4, scale: opened ? 1.12 : 1 }}
            transition={{ duration: 2.4, ease: EASE }}
            style={{
              background:
                "linear-gradient(180deg, white 0%, color-mix(in oklab, var(--champagne) 50%, white) 42%, transparent 100%)",
              filter: "blur(26px)",
              boxShadow: "0 0 110px 40px color-mix(in oklab, var(--champagne) 40%, transparent)",
            }}
            aria-hidden="true"
          />

          {/* Rings video — framed by the arch, sides feathered into the page */}
          <motion.div
            className="absolute bottom-[3%] left-1/2 z-[1] h-[84%] w-[min(94vw,36rem)] -translate-x-1/2 overflow-hidden sm:w-[78%]"
            initial={false}
            animate={{
              opacity: phase === "closed" ? 0.12 : phase === "opening" ? 0.55 : 1,
              scale: phase === "rings" ? 1.03 : 1,
            }}
            transition={{ duration: 2.2, ease: EASE }}
            style={{
              // Arch silhouette so the clip feels like the open gate, not a video player
              WebkitMaskImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 320' preserveAspectRatio='none'%3E%3Cdefs%3E%3ClinearGradient id='f' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='white' stop-opacity='0'/%3E%3Cstop offset='12%25' stop-color='white' stop-opacity='1'/%3E%3Cstop offset='88%25' stop-color='white' stop-opacity='1'/%3E%3Cstop offset='100%25' stop-color='white' stop-opacity='.35'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23f)' d='M14 320 V148 C14 74 50 20 100 4 C150 20 186 74 186 148 V320 Z'/%3E%3C/svg%3E\")",
              maskImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 320' preserveAspectRatio='none'%3E%3Cdefs%3E%3ClinearGradient id='f' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='white' stop-opacity='0'/%3E%3Cstop offset='12%25' stop-color='white' stop-opacity='1'/%3E%3Cstop offset='88%25' stop-color='white' stop-opacity='1'/%3E%3Cstop offset='100%25' stop-color='white' stop-opacity='.35'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23f)' d='M14 320 V148 C14 74 50 20 100 4 C150 20 186 74 186 148 V320 Z'/%3E%3C/svg%3E\")",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <video
              ref={videoRef}
              src={ringsUnion}
              className="h-full w-full object-cover"
              style={{
                // Warm grade so the clip matches ivory / champagne of the invitation
                filter:
                  "saturate(0.92) contrast(0.96) brightness(1.04) sepia(0.12)",
              }}
              muted
              playsInline
              preload="auto"
              aria-label="Two rings unite in light"
            />
            {/* Soft light wash — ties video into the gate glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, color-mix(in oklab, white 35%, transparent) 0%, transparent 55%), linear-gradient(180deg, color-mix(in oklab, var(--champagne) 18%, transparent) 0%, transparent 35%, color-mix(in oklab, #f4efe4 45%, transparent) 100%)",
                mixBlendMode: "soft-light",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                boxShadow:
                  "inset 0 0 60px 24px color-mix(in oklab, #f4efe4 55%, transparent), inset 0 -40px 50px color-mix(in oklab, var(--champagne) 20%, transparent)",
              }}
            />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center text-champagne/55"
            animate={{ opacity: opened ? 0 : 0.85, rotate: opened ? -12 : 0, scale: opened ? 1.2 : 1 }}
            transition={{ duration: 2, ease: EASE }}
            aria-hidden="true"
          >
            <GeometricStar className="h-[88%] w-[88%] animate-spin-slow" />
          </motion.div>

          <motion.button
            type="button"
            onClick={openDoors}
            disabled={opened}
            aria-label={opened ? "Gates open" : "Touch the doors to open"}
            className="absolute bottom-[2%] z-[2] flex h-[86%] w-[min(94vw,36rem)] cursor-pointer items-stretch justify-center border-0 bg-transparent p-0 sm:w-[78%]"
            style={{ transformStyle: "preserve-3d", WebkitTapHighlightColor: "transparent" }}
            whileTap={opened || reduce ? undefined : { scale: 0.985 }}
          >
            <HeavenDoor side="left" open={opened} reduce={!!reduce} />
            <HeavenDoor side="right" open={opened} reduce={!!reduce} />
          </motion.button>

          <svg
            viewBox="0 0 200 320"
            className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="heaven-arch-stroke" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--champagne)" stopOpacity="1" />
                <stop offset="50%" stopColor="#e8d5a3" stopOpacity="0.95" />
                <stop offset="100%" stopColor="var(--olivegold)" stopOpacity="0.55" />
              </linearGradient>
            </defs>
            <path
              d="M12 318 V144 C12 70 48 16 100 2 C152 16 188 70 188 144 V318"
              fill="none"
              stroke="url(#heaven-arch-stroke)"
              strokeWidth="1.6"
            />
            <path
              d="M28 318 V146 C28 86 56 36 100 20 C144 36 172 86 172 146 V318"
              fill="none"
              stroke="var(--champagne)"
              strokeWidth="0.55"
              opacity="0.5"
            />
          </svg>
        </div>
      </motion.div>

      {/* Ambient edge veil — keeps the whole viewport in the invitation palette while video plays */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[22]"
        initial={false}
        animate={{ opacity: phase === "rings" || phase === "opening" ? 1 : 0 }}
        transition={{ duration: 1.8, ease: EASE }}
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, transparent 28%, color-mix(in oklab, #f4efe4 55%, transparent) 62%, #f4efe4 92%)",
        }}
        aria-hidden="true"
      />

      {/* Couple names — fade in after the rings */}
      <AnimatePresence>
        {(phase === "names" || phase === "ready") && (
          <motion.div
            key="names"
            className="absolute inset-0 z-[30] flex flex-col items-center justify-center px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0.4 : 2.8, ease: EASE }}
          >
            <motion.p
              className="eyebrow text-ink/55"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: reduce ? 0 : 0.4, ease: EASE }}
            >
              with hearts full of gratitude
            </motion.p>
            <motion.h2
              className="mt-8 font-script text-6xl leading-none text-ink sm:text-8xl"
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 2, delay: reduce ? 0 : 0.9, ease: EASE }}
            >
              {invitation.groom}
            </motion.h2>
            <motion.p
              className="my-5 font-display text-2xl tracking-[0.3em] text-sandstone sm:text-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: reduce ? 0 : 1.7, ease: EASE }}
            >
              and
            </motion.p>
            <motion.p
              className="font-script text-6xl leading-none text-ink sm:text-8xl"
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 2, delay: reduce ? 0 : 2.1, ease: EASE }}
            >
              {invitation.bride}
            </motion.p>
            {phase === "ready" && (
              <motion.p
                className="eyebrow mt-14 text-ink/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, ease: EASE }}
              >
                scroll to continue
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom guide while closed */}
      <div className="relative z-30 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2">
        <AnimatePresence mode="wait">
          {phase === "closed" && (
            <motion.div
              key="guide"
              className="flex flex-col items-center gap-3 px-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <p className="font-display text-base text-ink/70 sm:text-lg">
                Touch the doors to open
              </p>
              <motion.span
                className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne/55 bg-card/70 text-olivegold shadow-[0_0_24px_color-mix(in_oklab,var(--champagne)_35%,transparent)] backdrop-blur-sm"
                animate={reduce ? undefined : { scale: [1, 1.06, 1], opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: EASE }}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M8 11V8a4 4 0 1 1 8 0v3M6 11h12v9H6z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-[25]"
        initial={false}
        animate={{
          opacity: phase === "opening" ? 0.5 : 0,
        }}
        transition={{ duration: 1.4, ease: EASE }}
        style={{
          background:
            "radial-gradient(circle at 50% 48%, white 0%, color-mix(in oklab, white 75%, var(--champagne)) 30%, transparent 72%)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}

function HeavenDoor({
  side,
  open,
  reduce,
}: {
  side: "left" | "right";
  open: boolean;
  reduce: boolean;
}) {
  const isLeft = side === "left";
  const rotateY = open ? (isLeft ? (reduce ? -75 : -98) : reduce ? 75 : 98) : 0;

  return (
    <motion.div
      className="relative h-full w-1/2 overflow-hidden"
      initial={false}
      animate={{ rotateY }}
      transition={{ duration: reduce ? 0.5 : 2.6, ease: EASE }}
      style={{
        transformOrigin: isLeft ? "left center" : "right center",
        transformStyle: "preserve-3d",
        background: isLeft
          ? "linear-gradient(105deg, #f7f0e2 0%, #efe4cf 22%, #e8d9b8 48%, #f3ead8 72%, #ebe0c8 100%)"
          : "linear-gradient(255deg, #f7f0e2 0%, #efe4cf 22%, #e8d9b8 48%, #f3ead8 72%, #ebe0c8 100%)",
        boxShadow: isLeft
          ? "inset -22px 0 36px rgba(180,150,90,0.18), inset 0 -20px 40px rgba(80,60,30,0.08), -14px 8px 40px rgba(40,30,15,0.12)"
          : "inset 22px 0 36px rgba(180,150,90,0.18), inset 0 -20px 40px rgba(80,60,30,0.08), 14px 8px 40px rgba(40,30,15,0.12)",
        borderRight: isLeft
          ? "1px solid color-mix(in oklab, var(--champagne) 75%, white)"
          : undefined,
        borderLeft: !isLeft
          ? "1px solid color-mix(in oklab, var(--champagne) 75%, white)"
          : undefined,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isLeft
            ? "linear-gradient(120deg, rgba(255,255,255,0.55) 0%, transparent 38%, rgba(201,169,110,0.18) 100%)"
            : "linear-gradient(240deg, rgba(255,255,255,0.55) 0%, transparent 38%, rgba(201,169,110,0.18) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-[7%] rounded-[2px]"
        style={{
          boxShadow:
            "inset 0 0 0 1px color-mix(in oklab, var(--champagne) 45%, transparent), inset 0 0 0 7px color-mix(in oklab, white 35%, transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute left-[14%] right-[14%] top-[12%] h-[34%] rounded-[2px]"
        style={{
          boxShadow:
            "inset 0 0 0 1px color-mix(in oklab, var(--champagne) 40%, transparent), inset 2px 2px 6px rgba(255,255,255,0.35), inset -2px -2px 6px rgba(120,90,40,0.12)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[12%] left-[14%] right-[14%] h-[34%] rounded-[2px]"
        style={{
          boxShadow:
            "inset 0 0 0 1px color-mix(in oklab, var(--champagne) 40%, transparent), inset 2px 2px 6px rgba(255,255,255,0.35), inset -2px -2px 6px rgba(120,90,40,0.12)",
        }}
      />
      <DoorFiligree side={side} />
      <div
        className="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2"
        style={{ ...(isLeft ? { right: "10%" } : { left: "10%" }) }}
      >
        <span
          className="block h-10 w-10 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #f3e6c4, var(--champagne) 45%, var(--olivegold) 80%)",
            boxShadow:
              "0 2px 6px rgba(80,60,20,0.25), inset 0 1px 2px rgba(255,255,255,0.65), 0 0 18px color-mix(in oklab, var(--champagne) 45%, transparent)",
            border: "1px solid color-mix(in oklab, var(--olivegold) 55%, white)",
          }}
        />
      </div>
    </motion.div>
  );
}

function DoorFiligree({ side }: { side: "left" | "right" }) {
  const mirror = side === "right" ? "scaleX(-1)" : undefined;
  return (
    <svg
      viewBox="0 0 120 220"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ transform: mirror }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`door-gold-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8d5a3" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--olivegold)" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#door-gold-${side})`} strokeWidth="0.7">
        <path d="M60 40 C82 58 82 86 60 106 C38 86 38 58 60 40 Z" opacity="0.8" />
        <path d="M60 106 C82 124 82 152 60 172 C38 152 38 124 60 106 Z" opacity="0.55" />
        <circle cx="60" cy="123" r="5.5" opacity="0.85" />
        <path
          d="M78 54c-7 1-12 7-12 14s5 13 12 14c-9 0-16-7-16-16s7-16 16-16z"
          opacity="0.5"
        />
        <path d="M30 188 Q60 168 90 188" opacity="0.4" />
      </g>
    </svg>
  );
}
