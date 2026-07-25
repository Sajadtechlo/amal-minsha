import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Ambient soundscape synthesised in the browser (no audio downloads):
 * a slow drone chord, gentle "strings" swell and sparse wind noise.
 * Starts only on an explicit user gesture, so autoplay policies are respected.
 */
export function AmbientAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const [on, setOn] = useState(false);

  const build = useCallback(() => {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // Warm drone chord (D2, A2, D3, F#3) — soft, consonant, unobtrusive.
    const chord = [73.42, 110, 146.83, 185];
    chord.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i > 1 ? "triangle" : "sine";
      osc.frequency.value = f;

      const detune = ctx.createOscillator();
      detune.frequency.value = 0.05 + i * 0.03;
      const detuneGain = ctx.createGain();
      detuneGain.gain.value = 2.5;
      detune.connect(detuneGain).connect(osc.detune);
      detune.start();

      const g = ctx.createGain();
      g.gain.value = 0.16 / (i + 1);

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.06 + i * 0.017;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.06 / (i + 1);
      lfo.connect(lfoGain).connect(g.gain);
      lfo.start();

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 900;

      osc.connect(g).connect(filter).connect(master);
      osc.start();
    });

    // Soft air / wind bed from filtered noise.
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;
    const nFilter = ctx.createBiquadFilter();
    nFilter.type = "bandpass";
    nFilter.frequency.value = 620;
    nFilter.Q.value = 0.7;
    const nGain = ctx.createGain();
    nGain.gain.value = 0.035;
    const nLfo = ctx.createOscillator();
    nLfo.frequency.value = 0.04;
    const nLfoGain = ctx.createGain();
    nLfoGain.gain.value = 0.02;
    nLfo.connect(nLfoGain).connect(nGain.gain);
    nLfo.start();
    noise.connect(nFilter).connect(nGain).connect(master);
    noise.start();

    ctxRef.current = ctx;
    masterRef.current = master;
  }, []);

  const toggle = useCallback(() => {
    if (!ctxRef.current) build();
    const ctx = ctxRef.current!;
    const master = masterRef.current!;
    void ctx.resume();
    const next = !on;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(next ? 0.5 : 0, now + (next ? 3.5 : 1.2));
    setOn(next);
  }, [build, on]);

  useEffect(() => () => void ctxRef.current?.close(), []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Mute ambient music" : "Play ambient music"}
      className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-champagne/50 bg-card/70 backdrop-blur-md transition-all duration-500 hover:border-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="sr-only">{on ? "Mute ambient music" : "Play ambient music"}</span>
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-olivegold" fill="none" aria-hidden="true">
        {on ? (
          <>
            <path
              d="M4 9v6h4l5 4V5L8 9H4Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <path
              d="M4 9v6h4l5 4V5L8 9H4Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path d="M17 9.5l4 5M21 9.5l-4 5" stroke="currentColor" strokeWidth="1.2" />
          </>
        )}
      </svg>
    </button>
  );
}
