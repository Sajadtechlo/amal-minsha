import { useMemo } from "react";

type Props = {
  count?: number;
  tone?: "rose" | "gold" | "light";
  className?: string;
};

/** CSS-only falling petals / motes. Cheap, GPU-friendly, respects reduced motion. */
export function Petals({ count = 14, tone = "rose", className = "" }: Props) {
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 97) % 100,
        size: 5 + ((i * 13) % 11),
        delay: (i * 1.7) % 18,
        duration: 20 + ((i * 7) % 18),
        drift: ((i % 5) - 2) * 40,
        opacity: 0.25 + ((i * 11) % 40) / 100,
      })),
    [count],
  );

  const color =
    tone === "rose"
      ? "color-mix(in oklab, var(--rose) 55%, white)"
      : tone === "gold"
        ? "color-mix(in oklab, var(--champagne) 70%, white)"
        : "color-mix(in oklab, white 80%, var(--champagne))";

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {seeds.map((s, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={{
            left: `${s.left}%`,
            width: tone === "light" ? Math.max(2, s.size / 3) : s.size,
            height: tone === "light" ? Math.max(2, s.size / 3) : s.size * 0.7,
            background: color,
            borderRadius: tone === "light" ? "50%" : "60% 20% 60% 20%",
            opacity: s.opacity,
            filter: tone === "light" ? "blur(0.5px)" : "blur(0.2px)",
            animation: `fall ${s.duration}s linear ${s.delay}s infinite`,
            ["--drift-x" as string]: `${s.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
