import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import musicUrl from "@/assets/music1.mp3";

export type AmbientAudioHandle = {
  /** Call from a user gesture (e.g. opening the invitation) so playback is allowed. */
  start: () => void;
};

/**
 * Invitation soundtrack from music1.mp3.
 * Plays by default once started from a user gesture; guests can mute via the control.
 */
export const AmbientAudio = forwardRef<AmbientAudioHandle, { enabled: boolean }>(
  function AmbientAudio({ enabled }, ref) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [on, setOn] = useState(true);

    useEffect(() => {
      const audio = new Audio(musicUrl);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0.55;
      audioRef.current = audio;
      return () => {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        audioRef.current = null;
      };
    }, []);

    const start = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      setOn(true);
      void audio.play().catch(() => {});
    }, []);

    useImperativeHandle(ref, () => ({ start }), [start]);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (enabled && on) {
        void audio.play().catch(() => {});
      } else if (!on || !enabled) {
        audio.pause();
      }
    }, [enabled, on]);

    const toggle = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      const next = !on;
      setOn(next);
      if (next) {
        void audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }, [on]);

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
