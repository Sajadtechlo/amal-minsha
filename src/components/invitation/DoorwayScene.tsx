import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useMemo, useRef } from "react";
import { GeometricStar } from "./Ornaments";
import gardenDawn from "@/assets/garden-dawn.jpg";

const EASE = [0.22, 0.61, 0.36, 1] as const;

function HeavenMotes({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean }) {
  const motes = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: ((i * 47) % 100) + (i % 7) * 0.3,
        top: ((i * 31) % 92) + 2,
        size: 1.5 + (i % 5),
        delay: (i % 13) * 0.1,
        drift: 6 + (i % 10),
      })),
    [],
  );

  // Soft motes visible from the first frame — the gate already feels alive.
  const opacity = useTransform(progress, [0, 0.35, 0.8, 1], [0.45, 1, 1, 0.12]);
  const scale = useTransform(progress, [0, 0.7, 1], [0.85, 1.15, 1.9]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ opacity, scale }}
      aria-hidden="true"
    >
      {motes.map((m) => (
        <span
          key={m.id}
          className="absolute rounded-full"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            background:
              m.id % 3 === 0
                ? "color-mix(in oklab, white 80%, var(--champagne))"
                : "var(--champagne)",
            opacity: 0.28 + (m.id % 5) * 0.1,
            boxShadow: "0 0 16px color-mix(in oklab, var(--champagne) 80%, white)",
            animation: reduce
              ? undefined
              : `heaven-mote ${6 + m.drift}s ease-in-out ${m.delay}s infinite`,
          }}
        />
      ))}
    </motion.div>
  );
}

function GodRays({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.15, 0.45, 0.85], [0.15, 0.75, 0.9]);
  const rotate = useTransform(progress, [0, 1], [-4, 8]);
  const scale = useTransform(progress, [0.2, 0.9], [0.95, 1.25]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute left-1/2 top-[8%] h-[160%] w-[180%] -translate-x-1/2"
        style={{
          rotate,
          scale,
          background:
            "conic-gradient(from 200deg at 50% 18%, transparent 0deg, color-mix(in oklab, white 40%, transparent) 14deg, transparent 28deg, color-mix(in oklab, var(--champagne) 38%, transparent) 44deg, transparent 60deg, color-mix(in oklab, white 30%, transparent) 78deg, transparent 96deg, color-mix(in oklab, var(--blush) 28%, transparent) 118deg, transparent 140deg, color-mix(in oklab, var(--champagne) 22%, transparent) 165deg, transparent 200deg)",
          filter: "blur(10px)",
        }}
      />
    </motion.div>
  );
}

/**
 * Scene 3 — The gates of heaven.
 * Doors open once into the heavenly garden — no second repeat of the same image.
 */
export function DoorwayScene() {
  const containerRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Slightly snappier so the gate never feels “stuck blank” behind a laggy spring.
  const progress = useSpring(scrollYProgress, {
    stiffness: reduce ? 140 : 54,
    damping: reduce ? 28 : 20,
    mass: 0.45,
  });

  // Everything meaningful is visible at progress 0 — no empty white frame.
  const starOpacity = useTransform(progress, [0, 0.28, 0.48], [0.75, 0.4, 0]);
  const starRotate = useTransform(progress, [0, 0.5], [8, -18]);
  const starScale = useTransform(progress, [0, 0.45], [1, 1.35]);

  const archOpacity = useTransform(progress, [0, 0.7, 0.9], [1, 1, 0]);
  const archScale = useTransform(progress, [0, 0.55, 0.95], [1, 1.05, 1.65]);
  const archDraw = useTransform(progress, [0, 0.01], [1, 1]); // drawn from the first frame
  const archDrawInner = useTransform(progress, [0, 0.01], [1, 1]);

  const doorOpen = useTransform(progress, [0.18, 0.52], [0, 1]);
  const leftDoorRotate = useTransform(doorOpen, (v) => (reduce ? -72 * v : -88 * v));
  const rightDoorRotate = useTransform(doorOpen, (v) => (reduce ? 72 * v : 88 * v));
  const doorLift = useTransform(doorOpen, (v) => `${-3 * v}%`);
  const doorGlow = useTransform(progress, [0, 0.35, 0.7], [0.55, 0.9, 1]);
  const doorOpacity = useTransform(progress, [0, 0.68, 0.82], [1, 1, 0]);

  const innerGlow = useTransform(progress, [0.1, 0.35, 0.55, 1], [0.2, 0.8, 1, 1]);
  const crackLight = useTransform(progress, [0.12, 0.28, 0.48], [0.35, 1, 0.15]);
  // Soft veil of light — never a second full-screen “reset” of the garden.
  const floodOpacity = useTransform(progress, [0.45, 0.58, 0.72, 0.88], [0, 0.35, 0.12, 0]);
  const floodBlur = useTransform(progress, [0.48, 0.7], [0, 4]);
  const passScale = useTransform(progress, [0.4, 0.75, 1], [1.02, 1.08, 1.06]);
  const passY = useTransform(progress, [0.4, 1], ["1%", "0%"]);
  const gardenClarity = useTransform(progress, [0.35, 0.6], [5, 0]);
  const gardenFilter = useTransform(gardenClarity, (v) => `blur(${v}px)`);
  const floodFilter = useTransform(floodBlur, (v) => `blur(${v}px)`);
  const veilOpacity = useTransform(progress, [0.62, 0.82], [1, 0]);
  const auroraOpacity = useTransform(progress, [0.2, 0.5, 0.85], [0.2, 0.45, 0.08]);
  const moteFade = useTransform(progress, [0, 0.5, 0.85], [1, 1, 0.15]);

  // Guidance stays until the doors are clearly opening
  const guideOpacity = useTransform(progress, [0, 0.2, 0.32], [1, 1, 0]);
  const titleOpacity = useTransform(progress, [0, 0.15, 0.35], [1, 1, 0]);
  const enterLine = useTransform(progress, [0.35, 0.45, 0.58, 0.7], [0, 1, 1, 0]);
  // Caption settles once — this is the garden, not a repeat scene.
  const gardenCaption = useTransform(progress, [0.72, 0.84, 1], [0, 1, 1]);
  const gardenVeil = useTransform(progress, [0.75, 0.95], [0.55, 0.2]);

  return (
    <section
      ref={containerRef}
      className="relative h-[260svh] sm:h-[240svh]"
      aria-label="The gates of heaven open"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden bg-ivory">
        {/* Warm heavenly atmosphere — never empty white */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(100% 70% at 50% 30%, color-mix(in oklab, var(--moonstone) 80%, white), transparent 60%), radial-gradient(90% 70% at 50% 70%, color-mix(in oklab, var(--blush) 45%, transparent), transparent 65%), radial-gradient(80% 50% at 50% 100%, color-mix(in oklab, var(--champagne) 40%, transparent), transparent 55%), #f7f1e6",
          }}
        />

        <motion.div
          className="absolute inset-0"
          style={{
            scale: passScale,
            y: passY,
            opacity: innerGlow,
            filter: gardenFilter,
          }}
        >
          <img
            src={gardenDawn}
            alt="A misty garden at dawn with olive trees reflected in still water"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: gardenVeil,
              background:
                "radial-gradient(ellipse at 50% 42%, color-mix(in oklab, white 45%, transparent) 0%, color-mix(in oklab, var(--champagne) 22%, transparent) 45%, color-mix(in oklab, #f7f1e6 70%, transparent) 80%)",
            }}
          />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            opacity: auroraOpacity,
            background:
              "linear-gradient(120deg, color-mix(in oklab, var(--blush) 35%, transparent), transparent 40%, color-mix(in oklab, var(--champagne) 40%, transparent) 60%, transparent)",
          }}
          aria-hidden="true"
        />

        <GodRays progress={progress} />
        <motion.div style={{ opacity: moteFade }} className="absolute inset-0">
          <HeavenMotes progress={progress} reduce={!!reduce} />
        </motion.div>

        {/* Title — always readable when the gate first appears */}
        <motion.div
          className="relative z-30 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] text-center sm:pt-10"
          style={{ opacity: titleOpacity }}
        >
          <p className="eyebrow text-ink/55">the gates of heaven</p>
          <p className="mt-3 font-display text-[1.35rem] font-light text-ink/75 sm:text-3xl">
            A door opens where mercy dwells
          </p>
        </motion.div>

        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{
            opacity: veilOpacity,
            perspective: reduce ? undefined : 1200,
            perspectiveOrigin: "50% 55%",
          }}
        >
          <motion.div
            className="relative flex h-[min(78svh,40rem)] w-[min(100vw,40rem)] items-end justify-center sm:h-[min(82svh,48rem)] sm:w-[min(92vw,38rem)]"
            style={{ scale: archScale, transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="absolute bottom-[4%] left-1/2 z-0 h-[78%] w-[58%] -translate-x-1/2 rounded-t-full sm:w-[50%]"
              style={{
                opacity: innerGlow,
                background:
                  "linear-gradient(180deg, color-mix(in oklab, white 95%, var(--champagne)) 0%, color-mix(in oklab, var(--champagne) 55%, white) 35%, color-mix(in oklab, var(--blush) 30%, transparent) 70%, transparent 100%)",
                filter: "blur(20px)",
                boxShadow:
                  "0 0 90px 28px color-mix(in oklab, var(--champagne) 50%, transparent)",
              }}
            />

            <motion.div
              className="absolute bottom-[8%] left-1/2 z-[1] h-[72%] w-[3px] -translate-x-1/2 rounded-full"
              style={{
                opacity: crackLight,
                background:
                  "linear-gradient(180deg, transparent, white 20%, var(--champagne) 50%, white 80%, transparent)",
                boxShadow: "0 0 22px 5px color-mix(in oklab, white 70%, var(--champagne))",
              }}
            />

            <motion.div
              className="absolute inset-0 z-[1] flex items-center justify-center text-champagne/70"
              style={{ opacity: starOpacity, scale: starScale, rotate: starRotate }}
            >
              <GeometricStar className="h-[90%] w-[90%]" />
            </motion.div>

            <motion.div
              className="absolute bottom-[2%] z-[2] flex h-[84%] w-[80%] items-stretch justify-center sm:h-[80%] sm:w-[70%]"
              style={{ transformStyle: "preserve-3d", opacity: doorOpacity, y: doorLift }}
            >
              <HeavenDoor side="left" rotateY={leftDoorRotate} glow={doorGlow} />
              <HeavenDoor side="right" rotateY={rightDoorRotate} glow={doorGlow} />
            </motion.div>

            <motion.svg
              viewBox="0 0 200 320"
              className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
              style={{ opacity: archOpacity }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="heaven-arch-stroke" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--champagne)" stopOpacity="1" />
                  <stop offset="55%" stopColor="var(--olivegold)" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="var(--champagne)" stopOpacity="0.45" />
                </linearGradient>
              </defs>
              <motion.path
                d="M14 318 V146 C14 74 50 20 100 4 C150 20 186 74 186 146 V318"
                fill="none"
                stroke="url(#heaven-arch-stroke)"
                strokeWidth="1.4"
                style={{ pathLength: archDraw }}
              />
              <motion.path
                d="M30 318 V148 C30 88 58 38 100 22 C142 38 170 88 170 148 V318"
                fill="none"
                stroke="var(--champagne)"
                strokeWidth="0.55"
                opacity="0.55"
                style={{ pathLength: archDrawInner }}
              />
            </motion.svg>
          </motion.div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            opacity: floodOpacity,
            filter: floodFilter,
            background:
              "radial-gradient(circle at 50% 46%, white 0%, color-mix(in oklab, white 80%, var(--champagne)) 24%, color-mix(in oklab, var(--champagne) 35%, white) 50%, color-mix(in oklab, #f7f1e6 75%, transparent) 74%, transparent 90%)",
          }}
          aria-hidden="true"
        />

        <motion.p
          className="pointer-events-none absolute inset-x-0 top-[42%] z-30 px-6 text-center font-display text-xl italic text-olivegold/90 sm:text-2xl"
          style={{ opacity: enterLine }}
        >
          step into the light
        </motion.p>

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-center pb-16"
          style={{ opacity: gardenCaption }}
        >
          <p className="eyebrow text-center text-ink/70">two paths, written long before</p>
        </motion.div>

        {/* Crystal-clear next step for every guest */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-40 flex flex-col items-center gap-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6"
          style={{
            opacity: guideOpacity,
            background:
              "linear-gradient(180deg, transparent, color-mix(in oklab, #f7f1e6 88%, transparent) 45%, #f7f1e6)",
          }}
        >
          <p className="font-display text-base text-ink/70 sm:text-lg">
            Scroll slowly to open the doors
          </p>
          <motion.span
            className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne/50 bg-card/60 text-olivegold backdrop-blur-sm"
            animate={reduce ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: EASE }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

function HeavenDoor({
  side,
  rotateY,
  glow,
}: {
  side: "left" | "right";
  rotateY: MotionValue<number>;
  glow: MotionValue<number>;
}) {
  const origin = side === "left" ? "left center" : "right center";
  const edge =
    side === "left"
      ? "inset -28px 0 50px color-mix(in oklab, var(--champagne) 28%, transparent), -10px 0 40px color-mix(in oklab, var(--ink) 6%, transparent)"
      : "inset 28px 0 50px color-mix(in oklab, var(--champagne) 28%, transparent), 10px 0 40px color-mix(in oklab, var(--ink) 6%, transparent)";

  const borderSide =
    side === "left"
      ? { borderRight: "1px solid color-mix(in oklab, var(--champagne) 70%, white)" }
      : { borderLeft: "1px solid color-mix(in oklab, var(--champagne) 70%, white)" };

  const sheenOpacity = useTransform(glow, (v) => 0.3 + v * 0.4);

  return (
    <motion.div
      className="relative h-full w-1/2 overflow-hidden"
      style={{
        rotateY,
        transformOrigin: origin,
        transformStyle: "preserve-3d",
        background:
          "linear-gradient(165deg, color-mix(in oklab, white 88%, var(--champagne)) 0%, color-mix(in oklab, var(--moonstone) 55%, white) 38%, color-mix(in oklab, var(--sandstone) 35%, var(--ivory)) 72%, color-mix(in oklab, var(--champagne) 22%, var(--ivory)) 100%)",
        boxShadow: edge,
        ...borderSide,
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: sheenOpacity,
          background:
            side === "left"
              ? "linear-gradient(115deg, color-mix(in oklab, white 70%, transparent) 0%, transparent 42%, color-mix(in oklab, var(--champagne) 25%, transparent) 100%)"
              : "linear-gradient(245deg, color-mix(in oklab, white 70%, transparent) 0%, transparent 42%, color-mix(in oklab, var(--champagne) 25%, transparent) 100%)",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, color-mix(in oklab, white 55%, transparent), transparent 70%)",
        }}
      />
      <DoorFiligree side={side} />
    </motion.div>
  );
}

function DoorFiligree({ side }: { side: "left" | "right" }) {
  const mirror = side === "right" ? "scaleX(-1)" : undefined;
  return (
    <svg
      viewBox="0 0 120 220"
      className="absolute inset-0 h-full w-full text-champagne/75"
      style={{ transform: mirror }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`door-gold-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--champagne)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--olivegold)" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#door-gold-${side})`} strokeWidth="0.75">
        <path d="M10 10 H110 V210 H10 Z" opacity="0.4" />
        <path d="M20 20 H100 V200 H20 Z" opacity="0.28" />
        <path d="M60 32 C82 50 82 78 60 98 C38 78 38 50 60 32 Z" opacity="0.85" />
        <path d="M60 98 C82 116 82 144 60 164 C38 144 38 116 60 98 Z" opacity="0.65" />
        <circle cx="60" cy="116" r="6" opacity="0.9" />
        <path d="M60 44 V88 M46 66 H74" opacity="0.5" />
        <path
          d="M78 52c-7 1-12 7-12 14s5 13 12 14c-9 0-16-7-16-16s7-16 16-16z"
          opacity="0.55"
        />
        <path d="M28 188 Q60 168 92 188" opacity="0.45" />
      </g>
    </svg>
  );
}
