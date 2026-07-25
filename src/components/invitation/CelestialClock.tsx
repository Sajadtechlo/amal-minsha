import { useEffect, useMemo, useState } from "react";
import { invitation } from "./data";
import { Reveal } from "./Reveal";
import { Divider } from "./Ornaments";

function useRemaining(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return useMemo(() => {
    const diff = Math.max(0, new Date(target).getTime() - now);
    const s = Math.floor(diff / 1000);
    return {
      total: diff,
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
    };
  }, [now, target]);
}

function Ring({
  radius,
  progress,
  label,
  value,
  opacity = 1,
}: {
  radius: number;
  progress: number;
  label: string;
  value: number;
  opacity?: number;
}) {
  const c = 2 * Math.PI * radius;
  return (
    <g opacity={opacity}>
      <circle
        cx="150"
        cy="150"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.25"
      />
      <circle
        cx="150"
        cy="150"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray={`${c * progress} ${c}`}
        transform="rotate(-90 150 150)"
        style={{ transition: "stroke-dasharray 900ms cubic-bezier(0.22,0.61,0.36,1)" }}
      />
      <circle
        cx={150 + radius * Math.cos(2 * Math.PI * progress - Math.PI / 2)}
        cy={150 + radius * Math.sin(2 * Math.PI * progress - Math.PI / 2)}
        r="2.4"
        fill="currentColor"
        style={{ transition: "all 900ms cubic-bezier(0.22,0.61,0.36,1)" }}
      >
        <title>{`${value} ${label}`}</title>
      </circle>
    </g>
  );
}

/** Scene 9 — a celestial clock rather than a digit counter. */
export function CelestialClock() {
  const { days, hours, minutes, seconds, total } = useRemaining(invitation.dateISO);
  const dayFraction = Math.min(1, days / 365);

  return (
    <section className="relative overflow-hidden px-6 py-28" aria-labelledby="countdown-title">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="eyebrow">The turning of the sky</p>
          <h2 id="countdown-title" className="mt-4 font-display text-3xl text-ink sm:text-4xl">
            {total > 0 ? "Until the Nikah" : "Today, alhamdulillah"}
          </h2>
          <Divider className="mt-8" />
        </Reveal>

        <Reveal delay={0.2} className="mt-12">
          <div className="relative mx-auto w-full max-w-[26rem]">
            <svg viewBox="0 0 300 300" className="w-full text-olivegold" role="img">
              <title>{`${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds remaining`}</title>
              <g className="animate-spin-slow" style={{ transformOrigin: "150px 150px" }}>
                {Array.from({ length: 48 }).map((_, i) => (
                  <line
                    key={i}
                    x1="150"
                    y1="16"
                    x2="150"
                    y2={i % 4 === 0 ? 26 : 21}
                    stroke="currentColor"
                    strokeWidth="0.5"
                    opacity="0.35"
                    transform={`rotate(${i * 7.5} 150 150)`}
                  />
                ))}
              </g>
              <Ring radius={116} progress={1 - dayFraction} label="days" value={days} />
              <Ring radius={96} progress={hours / 24} label="hours" value={hours} opacity={0.85} />
              <Ring
                radius={76}
                progress={minutes / 60}
                label="minutes"
                value={minutes}
                opacity={0.7}
              />
              <Ring
                radius={56}
                progress={seconds / 60}
                label="seconds"
                value={seconds}
                opacity={0.55}
              />
              <circle
                cx="150"
                cy="150"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.4"
                opacity="0.4"
              />
              <circle cx="150" cy="150" r="3" fill="currentColor" className="animate-breathe" />
            </svg>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="font-display text-4xl leading-none text-ink sm:text-5xl">{days}</p>
                <p className="eyebrow mt-2">days</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3} className="mt-10">
          <p className="eyebrow">
            {hours} hours · {minutes} minutes · {seconds} seconds
          </p>
        </Reveal>
      </div>
    </section>
  );
}
