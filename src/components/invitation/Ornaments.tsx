import type { SVGProps } from "react";

/** Eight-point Islamic star rosette, drawn as strokes so it can be animated. */
export function GeometricStar({
  className,
  strokeWidth = 0.6,
  ...props
}: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true" {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round">
        <circle cx="100" cy="100" r="86" opacity="0.35" />
        <circle cx="100" cy="100" r="66" opacity="0.25" />
        {petals.map((a) => (
          <g key={a} transform={`rotate(${a} 100 100)`}>
            <path d="M100 16 L128 62 L100 84 L72 62 Z" opacity="0.7" />
            <path d="M100 40 L112 66 L100 78 L88 66 Z" opacity="0.45" />
            <path d="M100 84 L100 116" opacity="0.2" />
          </g>
        ))}
        {[0, 45].map((a) => (
          <rect
            key={a}
            x="52"
            y="52"
            width="96"
            height="96"
            transform={`rotate(${a} 100 100)`}
            opacity="0.5"
          />
        ))}
      </g>
    </svg>
  );
}

/** Thin gold divider with a diamond at its centre. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="gold-rule h-px w-16 sm:w-28" />
      <svg viewBox="0 0 24 24" className="h-3 w-3 text-champagne">
        <path
          d="M12 1 L17 12 L12 23 L7 12 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
      <span className="gold-rule h-px w-16 sm:w-28" />
    </div>
  );
}

/** Ogee arch outline used for the doorway and for framing panels. */
export function Arch({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 320" fill="none" className={className} aria-hidden="true" {...props}>
      <path
        d="M10 318 V150 C10 84 46 26 100 6 C154 26 190 84 190 150 V318"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M26 318 V152 C26 94 56 44 100 26 C144 44 174 94 174 152 V318"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.55"
        fill="none"
      />
    </svg>
  );
}

/** Single stylised olive leaf, used for floating botanical particles. */
export function Leaf({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
      <path
        d="M22 2C12 3 4 8 3 17c0 3 2 5 4 5 8 0 15-9 15-20Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path d="M20 4C14 8 9 13 6 20" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
    </svg>
  );
}
