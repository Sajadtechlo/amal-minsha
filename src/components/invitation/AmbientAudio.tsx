import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import musicUrl from "@/assets/music1.mp3";

export type AmbientAudioHandle = {
  /** Call from a user gesture (e.g. opening the invitation) so playback is allowed. */
  start: () => void;
};

/** Near silence — a breath before the score arrives. */
const WHISPER_VOLUME = 0.02;
/** Full cinematic presence. */
const TARGET_VOLUME = 1;
/** Long swell so the rise feels scored, not switched on. */
const SWELL_MS = 10000;

/** Quiet for longer, then blooms — cinematic ease, not a linear fade. */
function cinematicEase(t: number) {
  const x = Math.min(1, Math.max(0, t));
  // First third: barely-there whisper
  if (x < 0.32) {
    return 0.12 * Math.pow(x / 0.32, 1.85);
  }
  // Remaining: smooth bloom into full voice
  const u = (x - 0.32) / 0.68;
  const smooth = u * u * (3 - 2 * u);
  return 0.12 + 0.88 * Math.pow(smooth, 1.15);
}

/**
 * Invitation soundtrack from music1.mp3.
 * Begins as a faint whisper and elevates cinematically to full presence.
 */
export const AmbientAudio = forwardRef<AmbientAudioHandle, { enabled: boolean }>(
  function AmbientAudio({ enabled }, ref) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const swellingRef = useRef(false);
    const [on, setOn] = useState(true);

    const clearSwell = useCallback(() => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      swellingRef.current = false;
    }, []);

    const swellCinematically = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      clearSwell();
      swellingRef.current = true;
      audio.volume = WHISPER_VOLUME;
      const started = performance.now();

      const tick = (now: number) => {
        if (!swellingRef.current || !audioRef.current) return;
        const t = Math.min(1, (now - started) / SWELL_MS);
        audioRef.current.volume = WHISPER_VOLUME + (TARGET_VOLUME - WHISPER_VOLUME) * cinematicEase(t);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          audioRef.current.volume = TARGET_VOLUME;
          swellingRef.current = false;
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    }, [clearSwell]);

    useEffect(() => {
      const audio = new Audio(musicUrl);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = WHISPER_VOLUME;
      audioRef.current = audio;
      return () => {
        clearSwell();
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        audioRef.current = null;
      };
    }, [clearSwell]);

    const beginScore = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      setOn(true);
      audio.volume = WHISPER_VOLUME;
      void audio.play().then(() => swellCinematically()).catch(() => {});
    }, [swellCinematically]);

    useImperativeHandle(ref, () => ({ start: beginScore }), [beginScore]);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (enabled && on) {
        // Only start a new swell if we are not already rising or near full.
        if (!swellingRef.current && audio.volume < 0.85) {
          void audio.play().then(() => swellCinematically()).catch(() => {});
        } else {
          void audio.play().catch(() => {});
        }
      } else {
        clearSwell();
        audio.pause();
      }
    }, [enabled, on, swellCinematically, clearSwell]);

    const toggle = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      const next = !on;
      setOn(next);
      if (next) {
        beginScore();
      } else {
        clearSwell();
        audio.pause();
        audio.volume = WHISPER_VOLUME;
      }
    }, [on, beginScore, clearSwell]);

    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Mute invitation music" : "Play invitation music"}
        className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-champagne/50 bg-card/70 backdrop-blur-md transition-all duration-500 hover:border-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="sr-only">{on ? "Mute invitation music" : "Play invitation music"}</span>
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
  },
);
