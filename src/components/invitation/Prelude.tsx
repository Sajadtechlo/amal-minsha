import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { GeometricStar } from "./Ornaments";
import { invitation } from "./data";

const EASE = [0.22, 0.61, 0.36, 1] as const;

/**
 * Scene 1 — A heavenly veil. Soft dawn light, gold geometry, and a quiet invitation to begin.
 */
export function Prelude({ onEnter }: { onEnter: () => void }) {
  const [open, setOpen] = useState(true);
  const reduce = useReducedMotion();

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
          exit={{ opacity: 0, filter: "blur(16px)" }}
          transition={{ duration: 2.4, ease: EASE }}
        >
          {/* Soft celestial glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 35%, color-mix(in oklab, white 70%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 50% 80%, color-mix(in oklab, var(--champagne) 28%, transparent), transparent 50%)",
            }}
            aria-hidden="true"
          />

          {/* drifting golden motes */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {Array.from({ length: 36 }).map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-champagne"
                style={{
                  left: `${(i * 61) % 100}%`,
                  top: `${(i * 37) % 100}%`,
                  width: 1.5 + (i % 3),
                  height: 1.5 + (i % 3),
                  opacity: 0.2 + ((i * 7) % 40) / 100,
                  boxShadow: "0 0 10px color-mix(in oklab, var(--champagne) 60%, white)",
                  animation: `shimmer ${6 + (i % 9)}s ease-in-out ${(i % 11) * 0.6}s infinite, drift ${18 + (i % 12)}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>

          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-champagne/30"
            initial={{ opacity: 0, scale: 0.92, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: reduce ? 0.3 : 5.5, ease: "easeOut" }}
            aria-hidden="true"
          >
            <GeometricStar className="h-[78vmin] w-[78vmin] animate-spin-slow" />
          </motion.div>

          <div className="relative z-10 px-8 text-center">
            <motion.p
              className="font-arabic text-lg text-olivegold/90 sm:text-2xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.8, delay: 0.8, ease: EASE }}
              dir="rtl"
            >
              {invitation.bismillah}
            </motion.p>

            <motion.p
              className="mt-8 font-display text-sm tracking-[0.28em] text-ink/45 sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2.4, delay: 1.8, ease: EASE }}
            >
              Amal & Minsha
            </motion.p>

            <motion.button
              type="button"
              onClick={enter}
              className="group mt-12 inline-flex flex-col items-center gap-4 focus-visible:outline-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.2, delay: 2.4, ease: EASE }}
              aria-label="Tap to open the invitation"
            >
              <motion.span
                className="eyebrow tracking-[0.28em] text-ink/65"
                animate={
                  reduce
                    ? undefined
                    : {
                        opacity: [0.45, 1, 0.45],
                        textShadow: [
                          "0 0 0 transparent",
                          "0 0 18px color-mix(in oklab, var(--champagne) 70%, transparent)",
                          "0 0 0 transparent",
                        ],
                      }
                }
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                Tap to open
              </motion.span>

              <span className="relative flex h-16 w-16 items-center justify-center">
                {/* Expanding blink rings — the clear “tap here” cue */}
                {!reduce && (
                  <>
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full border border-olivegold/50"
                      style={{ animation: "invite-ring 2.2s ease-out infinite" }}
                      aria-hidden="true"
                    />
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full border border-champagne/45"
                      style={{ animation: "invite-ring 2.2s ease-out 0.7s infinite" }}
                      aria-hidden="true"
                    />
                  </>
                )}

                <motion.span
                  className="relative flex h-14 w-14 items-center justify-center rounded-full border border-champagne/70 bg-card/55 backdrop-blur-sm"
                  animate={
                    reduce
                      ? undefined
                      : {
                          scale: [1, 1.08, 1],
                          boxShadow: [
                            "0 0 0 0 color-mix(in oklab, var(--champagne) 0%, transparent)",
                            "0 0 34px 8px color-mix(in oklab, var(--champagne) 55%, transparent)",
                            "0 0 0 0 color-mix(in oklab, var(--champagne) 0%, transparent)",
                          ],
                          borderColor: [
                            "color-mix(in oklab, var(--champagne) 55%, white)",
                            "color-mix(in oklab, var(--olivegold) 85%, white)",
                            "color-mix(in oklab, var(--champagne) 55%, white)",
                          ],
                        }
                  }
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="absolute inset-0 animate-breathe rounded-full bg-champagne/20" />
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
