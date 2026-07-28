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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2.6, delay: 2.6, ease: EASE }}
            >
              <span className="eyebrow text-ink/55">Open the invitation</span>
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-champagne/55 bg-card/40 shadow-[0_0_28px_color-mix(in_oklab,var(--champagne)_30%,transparent)] backdrop-blur-sm transition-all duration-700 group-hover:border-olivegold group-focus-visible:border-olivegold">
                <span className="absolute inset-0 animate-breathe rounded-full bg-champagne/15" />
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-olivegold"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
