import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GeometricStar } from "./Ornaments";
import gardenDawn from "@/assets/garden-dawn.jpg";
import ringsUnion from "@/assets/35575-407595493.mp4";

const EASE = [0.22, 0.61, 0.36, 1] as const;
const OPEN_MS = 2800;

type GatePhase = "closed" | "opening" | "rings" | "entered";

/**
 * Scene 3 — The gates of heaven.
 * Guests touch the doors to open them. Through the light, the union of two rings
 * plays — then the garden beyond. No scroll required to open.
 */
export function DoorwayScene() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<GatePhase>("closed");
  const opened = phase !== "closed";

  const openDoors = useCallback(() => {
    if (phase !== "closed") return;
    setPhase("opening");
    window.setTimeout(
      () => {
        setPhase("rings");
        const video = videoRef.current;
        if (video) {
          video.currentTime = 0;
          void video.play().catch(() => {});
        }
      },
      reduce ? 400 : OPEN_MS * 0.55,
    );
  }, [phase, reduce]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => setPhase("entered");
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, []);

  // Soft fallback if video stalls — still let the guest continue.
  useEffect(() => {
    if (phase !== "rings") return;
    const fallback = window.setTimeout(() => setPhase("entered"), 9000);
    return () => window.clearTimeout(fallback);
  }, [phase]);

  const motes = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: ((i * 53) % 100),
        top: ((i * 37) % 90) + 4,
        size: 1.5 + (i % 4),
        delay: (i % 9) * 0.35,
      })),
    [],
  );

  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      aria-label="The gates of heaven"
      style={{
        background:
          "radial-gradient(100% 70% at 50% 28%, color-mix(in oklab, var(--moonstone) 75%, white), transparent 58%), radial-gradient(90% 65% at 50% 78%, color-mix(in oklab, var(--blush) 40%, transparent), transparent 62%), #f4efe4",
      }}
    >
      {/* World beyond — garden settles after the rings */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: phase === "entered" ? 1 : phase === "rings" ? 0.35 : 0.15,
          scale: phase === "entered" ? 1 : 1.06,
        }}
        transition={{ duration: reduce ? 0.4 : 2.4, ease: EASE }}
      >
        <img
          src={gardenDawn}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 42%, color-mix(in oklab, white 50%, transparent), color-mix(in oklab, #f4efe4 75%, transparent) 78%)",
          }}
        />
      </motion.div>

      {/* Floating motes */}
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
              opacity: opened ? 0.55 : 0.3,
              boxShadow: "0 0 14px color-mix(in oklab, var(--champagne) 75%, white)",
              animation: reduce ? undefined : `heaven-mote ${8 + (m.id % 6)}s ease-in-out ${m.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <motion.div
        className="relative z-30 px-5 pt-[max(1.1rem,env(safe-area-inset-top))] text-center sm:pt-9"
        animate={{ opacity: opened ? 0 : 1, y: opened ? -12 : 0 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <p className="eyebrow text-ink/55">the gates of heaven</p>
        <p className="mt-3 font-display text-[1.35rem] font-light text-ink/75 sm:text-3xl">
          A door opens where mercy dwells
        </p>
      </motion.div>

      {/* Stage */}
      <div
        className="relative z-20 mx-auto flex w-full max-w-[40rem] flex-1 items-center justify-center px-0 sm:px-4"
        style={{ perspective: reduce ? undefined : "1400px", perspectiveOrigin: "50% 55%" }}
      >
        <div
          className="relative flex h-[min(78svh,42rem)] w-full items-end justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Soft glow behind doors */}
          <motion.div
            className="absolute bottom-[5%] left-1/2 z-0 h-[76%] w-[56%] -translate-x-1/2 rounded-t-full"
            animate={{
              opacity: opened ? 1 : 0.45,
              scale: opened ? 1.08 : 1,
            }}
            transition={{ duration: reduce ? 0.3 : 2.2, ease: EASE }}
            style={{
              background:
                "linear-gradient(180deg, white 0%, color-mix(in oklab, var(--champagne) 55%, white) 40%, transparent 100%)",
              filter: "blur(22px)",
              boxShadow: "0 0 100px 36px color-mix(in oklab, var(--champagne) 45%, transparent)",
            }}
            aria-hidden="true"
          />

          {/* Rings video — revealed through the open gate */}
          <motion.div
            className="absolute bottom-[6%] left-1/2 z-[1] h-[72%] w-[62%] -translate-x-1/2 overflow-hidden rounded-t-[48%]"
            initial={false}
            animate={{
              opacity: phase === "rings" || phase === "entered" ? 1 : 0,
              scale: phase === "entered" ? 1.04 : 1,
            }}
            transition={{ duration: 1.4, ease: EASE }}
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 88% 100% at 50% 100%, black 58%, transparent 78%)",
              maskImage:
                "radial-gradient(ellipse 88% 100% at 50% 100%, black 58%, transparent 78%)",
              boxShadow: "0 0 60px 10px color-mix(in oklab, var(--champagne) 35%, transparent)",
            }}
          >
            <video
              ref={videoRef}
              src={ringsUnion}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="auto"
              aria-label="Two rings unite in light"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, transparent 30%, color-mix(in oklab, var(--champagne) 25%, transparent) 100%)",
              }}
            />
          </motion.div>

          {/* Geometry behind closed gate */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center text-champagne/55"
            animate={{ opacity: opened ? 0 : 0.85, rotate: opened ? -12 : 0, scale: opened ? 1.2 : 1 }}
            transition={{ duration: 2, ease: EASE }}
            aria-hidden="true"
          >
            <GeometricStar className="h-[88%] w-[88%] animate-spin-slow" />
          </motion.div>

          {/* Twin doors — tap to open */}
          <motion.button
            type="button"
            onClick={openDoors}
            disabled={opened}
            aria-label={opened ? "Gates open" : "Touch the doors to open"}
            className="absolute bottom-[2%] z-[2] flex h-[84%] w-[82%] cursor-pointer items-stretch justify-center border-0 bg-transparent p-0 sm:w-[72%]"
            style={{ transformStyle: "preserve-3d", WebkitTapHighlightColor: "transparent" }}
            whileTap={opened || reduce ? undefined : { scale: 0.985 }}
          >
            <HeavenDoor
              side="left"
              open={opened}
              reduce={!!reduce}
            />
            <HeavenDoor
              side="right"
              open={opened}
              reduce={!!reduce}
            />
          </motion.button>

          {/* Gold arch frame */}
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
              <filter id="arch-soft-glow" x="-30%" y="-20%" width="160%" height="140%">
                <feGaussianBlur stdDeviation="1.4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M12 318 V144 C12 70 48 16 100 2 C152 16 188 70 188 144 V318"
              fill="none"
              stroke="url(#heaven-arch-stroke)"
              strokeWidth="1.6"
              filter="url(#arch-soft-glow)"
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
      </div>

      {/* Guidance / after-open copy */}
      <div className="relative z-30 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2">
        <AnimatePresence mode="wait">
          {!opened ? (
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
          ) : phase === "rings" ? (
            <motion.p
              key="rings"
              className="px-6 text-center font-display text-lg italic text-olivegold/90 sm:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: EASE }}
            >
              two souls, one covenant
            </motion.p>
          ) : (
            <motion.div
              key="entered"
              className="flex flex-col items-center gap-2 px-6 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: EASE }}
            >
              <p className="eyebrow text-ink/65">two paths, written long before</p>
              <p className="font-display text-sm text-ink/50">scroll to continue</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Light flood while opening */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[25]"
        initial={false}
        animate={{
          opacity: phase === "opening" ? 0.55 : phase === "rings" ? 0.2 : 0,
        }}
        transition={{ duration: 1.6, ease: EASE }}
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
        borderRight: isLeft ? "1px solid color-mix(in oklab, var(--champagne) 75%, white)" : undefined,
        borderLeft: !isLeft ? "1px solid color-mix(in oklab, var(--champagne) 75%, white)" : undefined,
      }}
    >
      {/* Pearlescent sheen */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isLeft
            ? "linear-gradient(120deg, rgba(255,255,255,0.55) 0%, transparent 38%, rgba(201,169,110,0.18) 100%)"
            : "linear-gradient(240deg, rgba(255,255,255,0.55) 0%, transparent 38%, rgba(201,169,110,0.18) 100%)",
        }}
      />

      {/* Raised panel moldings — realistic door construction */}
      <div
        className="pointer-events-none absolute inset-[7%] rounded-[2px]"
        style={{
          boxShadow:
            "inset 0 0 0 1px color-mix(in oklab, var(--champagne) 45%, transparent), inset 0 0 0 7px color-mix(in oklab, white 35%, transparent), 0 1px 0 color-mix(in oklab, var(--olivegold) 25%, transparent)",
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

      {/* Ornate handle near the meeting edge */}
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
