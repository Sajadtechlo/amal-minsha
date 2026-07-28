import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Divider, GeometricStar } from "./Ornaments";
import { invitation } from "./data";

const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * Scene 1 — A heavenly veil.
 * Soft dawn light, luminous calligraphy, and the couple’s names as the first breath of the invitation.
 */
export function Prelude({ onEnter }: { onEnter: () => void }) {
  const [open, setOpen] = useState(true);
  const reduce = useReducedMotion();

  const motes = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        id: i,
        left: (i * 61) % 100,
        top: (i * 37) % 100,
        size: 1.2 + (i % 4) * 0.7,
        delay: (i % 11) * 0.55,
        drift: 14 + (i % 12),
        shimmer: 5 + (i % 9),
      })),
    [],
  );

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const enter = () => {
    setOpen(false);
    onEnter();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="prelude"
          className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
          style={{ background: "var(--gradient-heaven)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(18px)" }}
          transition={{ duration: 2.6, ease: EASE }}
        >
          {/* Heavenly bloom — light pouring from above */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 18%, color-mix(in oklab, white 88%, var(--champagne)) 0%, transparent 62%), radial-gradient(ellipse 90% 60% at 50% 100%, color-mix(in oklab, var(--blush) 42%, transparent), transparent 55%)",
            }}
            aria-hidden="true"
          />

          {/* Soft light shafts */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0.4 : 4.5, ease: "easeOut" }}
            aria-hidden="true"
          >
            <div
              className="absolute left-1/2 top-[-8%] h-[75%] w-[min(72vw,28rem)] -translate-x-1/2"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in oklab, white 70%, transparent) 0%, color-mix(in oklab, var(--champagne) 22%, transparent) 42%, transparent 100%)",
                filter: "blur(28px)",
                opacity: 0.7,
                animation: reduce ? undefined : "heaven-shaft 9s ease-in-out infinite",
              }}
            />
            <div
              className="absolute left-[28%] top-[-5%] h-[55%] w-[18%] -rotate-6"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in oklab, white 45%, transparent), transparent 80%)",
                filter: "blur(22px)",
                opacity: 0.35,
              }}
            />
            <div
              className="absolute right-[26%] top-[-5%] h-[55%] w-[18%] rotate-6"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in oklab, white 45%, transparent), transparent 80%)",
                filter: "blur(22px)",
                opacity: 0.35,
              }}
            />
          </motion.div>

          {/* drifting golden motes */}
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
                  opacity: 0.18 + (m.id % 5) * 0.08,
                  boxShadow: "0 0 14px color-mix(in oklab, var(--champagne) 75%, white)",
                  animation: reduce
                    ? undefined
                    : `shimmer ${m.shimmer}s ease-in-out ${m.delay}s infinite, drift ${m.drift}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>

          {/* Celestial geometry — quiet, slow, luminous */}
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-champagne/25"
            initial={{ opacity: 0, scale: 0.88, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: reduce ? 0.3 : 6.5, ease: "easeOut" }}
            aria-hidden="true"
          >
            <GeometricStar className="h-[88vmin] w-[88vmin] animate-spin-slow" strokeWidth={0.45} />
          </motion.div>

          {/* Soft halo behind the names */}
          <div
            className="pointer-events-none absolute left-1/2 top-[46%] h-[42vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, white 75%, var(--champagne)) 0%, transparent 68%)",
              filter: "blur(8px)",
              opacity: 0.85,
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center sm:px-10">
            <motion.p
              className="eyebrow text-ink/40"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.2, delay: 0.35, ease: EASE }}
            >
              a sacred beginning
            </motion.p>

            <motion.p
              className="mt-7 font-arabic text-[1.55rem] leading-[2.15] text-olivegold sm:mt-9 sm:text-4xl sm:leading-[2.35]"
              style={{
                textShadow:
                  "0 0 28px color-mix(in oklab, var(--champagne) 55%, transparent), 0 1px 0 color-mix(in oklab, white 40%, transparent)",
              }}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: reduce ? 0.4 : 3.2, delay: reduce ? 0 : 0.9, ease: EASE }}
              dir="rtl"
              lang="ar"
            >
              {invitation.bismillah}
            </motion.p>

            <motion.div
              className="mt-8 w-full sm:mt-10"
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 2.4, delay: reduce ? 0 : 1.9, ease: EASE }}
            >
              <Divider />
            </motion.div>

            {/* Brand as the heavenly centrepiece */}
            <motion.h1
              className="mt-7 flex flex-col items-center"
              initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: reduce ? 0.4 : 3, delay: reduce ? 0 : 2.2, ease: EASE }}
            >
              <span
                className="font-script text-[3.4rem] leading-[0.95] text-ink sm:text-7xl md:text-8xl"
                style={{
                  textShadow:
                    "0 0 40px color-mix(in oklab, white 70%, transparent), 0 12px 40px color-mix(in oklab, var(--champagne) 25%, transparent)",
                }}
              >
                {invitation.groom}
              </span>
              <span className="mt-3 font-display text-lg font-light italic tracking-[0.35em] text-sandstone sm:mt-4 sm:text-2xl">
                and
              </span>
              <span
                className="mt-3 font-script text-[3.4rem] leading-[0.95] text-ink sm:mt-4 sm:text-7xl md:text-8xl"
                style={{
                  textShadow:
                    "0 0 40px color-mix(in oklab, white 70%, transparent), 0 12px 40px color-mix(in oklab, var(--champagne) 25%, transparent)",
                }}
              >
                {invitation.bride}
              </span>
            </motion.h1>

            <motion.p
              className="mt-8 max-w-md font-display text-base font-light italic leading-relaxed text-ink/55 sm:mt-10 sm:text-xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.4, delay: reduce ? 0 : 3.9, ease: EASE }}
            >
              With hearts full of gratitude, we invite you into our light
            </motion.p>

            <motion.button
              type="button"
              onClick={enter}
              className="group mt-10 inline-flex flex-col items-center gap-4 focus-visible:outline-none sm:mt-12"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.2, delay: reduce ? 0 : 4.6, ease: EASE }}
              aria-label="Tap to open the invitation"
            >
              <motion.span
                className="eyebrow tracking-[0.32em] text-ink/60"
                animate={
                  reduce
                    ? undefined
                    : {
                        opacity: [0.4, 1, 0.4],
                        textShadow: [
                          "0 0 0 transparent",
                          "0 0 22px color-mix(in oklab, var(--champagne) 75%, transparent)",
                          "0 0 0 transparent",
                        ],
                      }
                }
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Tap to open
              </motion.span>

              <span className="relative flex h-16 w-16 items-center justify-center">
                {!reduce && (
                  <>
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full border border-olivegold/55"
                      style={{ animation: "invite-ring 2.2s ease-out infinite" }}
                      aria-hidden="true"
                    />
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full border border-champagne/50"
                      style={{ animation: "invite-ring 2.2s ease-out 0.7s infinite" }}
                      aria-hidden="true"
                    />
                  </>
                )}

                <motion.span
                  className="relative flex h-14 w-14 items-center justify-center rounded-full border border-champagne/75 bg-card/50 backdrop-blur-sm"
                  animate={
                    reduce
                      ? undefined
                      : {
                          scale: [1, 1.08, 1],
                          boxShadow: [
                            "0 0 0 0 color-mix(in oklab, var(--champagne) 0%, transparent)",
                            "0 0 36px 10px color-mix(in oklab, var(--champagne) 55%, transparent)",
                            "0 0 0 0 color-mix(in oklab, var(--champagne) 0%, transparent)",
                          ],
                          borderColor: [
                            "color-mix(in oklab, var(--champagne) 55%, white)",
                            "color-mix(in oklab, var(--olivegold) 85%, white)",
                            "color-mix(in oklab, var(--champagne) 55%, white)",
                          ],
                        }
                  }
                  transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="absolute inset-0 animate-breathe rounded-full bg-champagne/25" />
                  <svg
                    viewBox="0 0 24 24"
                    className="relative z-10 h-5 w-5 text-olivegold"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.35"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.span>
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
