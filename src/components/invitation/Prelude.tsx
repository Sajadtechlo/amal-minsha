import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { GeometricStar } from "./Ornaments";
import { invitation } from "./data";

/**
 * Scene 1 — Silence. A dark, still overlay with slow motes and a single
 * invitation to begin. Dismissing it hands control back to the scroll story.
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
          style={{ background: "var(--gradient-night)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(14px)" }}
          transition={{ duration: 2.2, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {/* drifting motes */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-champagne"
                style={{
                  left: `${(i * 61) % 100}%`,
                  top: `${(i * 37) % 100}%`,
                  width: 1 + (i % 3),
                  height: 1 + (i % 3),
                  opacity: 0.15 + ((i * 7) % 50) / 100,
                  animation: `shimmer ${6 + (i % 9)}s ease-in-out ${(i % 11) * 0.6}s infinite, drift ${18 + (i % 12)}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>

          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-champagne/25"
            initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: reduce ? 0.3 : 6, ease: "easeOut" }}
            aria-hidden="true"
          >
            <GeometricStar className="h-[80vmin] w-[80vmin] animate-spin-slow" />
          </motion.div>

          <div className="relative z-10 px-8 text-center">
            <motion.p
              className="font-arabic text-lg text-champagne/85 sm:text-2xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 3, delay: 1.2 }}
              dir="rtl"
            >
              {invitation.bismillah}
            </motion.p>

            <motion.button
              type="button"
              onClick={enter}
              className="group mt-14 inline-flex flex-col items-center gap-4 focus-visible:outline-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3, delay: 3 }}
            >
              <span className="eyebrow text-[color:color-mix(in_oklab,var(--champagne)_85%,white)]">
                Open the invitation
              </span>
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-champagne/40 transition-all duration-700 group-hover:border-champagne group-focus-visible:border-champagne">
                <span className="absolute inset-0 animate-breathe rounded-full bg-champagne/10" />
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-champagne"
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
