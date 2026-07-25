import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { Toaster } from "sonner";
import { Prelude } from "@/components/invitation/Prelude";
import {
  AnnouncementScene,
  BlessingScene,
  DoorwayScene,
  GardenScene,
  SoulsScene,
  VenueScene,
  VerseScene,
} from "@/components/invitation/Scenes";
import { CelestialClock } from "@/components/invitation/CelestialClock";
import { RsvpScene } from "@/components/invitation/RsvpScene";
import { AmbientAudio, type AmbientAudioHandle } from "@/components/invitation/AmbientAudio";
import { invitation } from "@/components/invitation/data";
import { absoluteUrl, SITE_URL } from "@/lib/site";

const title = "The Wedding of Amal Ameen & Minsha";
const description = `Nikah Mubarak · ${invitation.dayName}, ${invitation.monthName} ${invitation.day}, ${invitation.year} · ${invitation.venue}, ${invitation.city}`;
const ogImagePath = "/og-invitation.png";

/** Resolve the public origin for absolute OG/Twitter image URLs (WhatsApp needs these). */
const getSiteOrigin = createServerFn({ method: "GET" }).handler(async () => {
  if (SITE_URL) return SITE_URL;
  // Netlify injects URL / DEPLOY_PRIME_URL at runtime and during builds.
  const netlifyUrl = process.env.URL || process.env.DEPLOY_PRIME_URL;
  if (netlifyUrl) return netlifyUrl.replace(/\/$/, "");
  try {
    const { getRequestUrl } = await import("@tanstack/react-start/server");
    return getRequestUrl({ xForwardedHost: true, xForwardedProto: true }).origin;
  } catch {
    return "";
  }
});

export const Route = createFileRoute("/")({
  loader: () => getSiteOrigin(),
  head: ({ loaderData }) => {
    const origin =
      loaderData ||
      SITE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const ogImage = absoluteUrl(ogImagePath, origin);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:image", content: ogImage },
        { property: "og:image:alt", content: title },
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: "682" },
        { property: "og:image:height", content: "1024" },
        ...(origin ? [{ property: "og:url", content: absoluteUrl("/", origin) }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "image_src", href: ogImage }],
    };
  },
  component: Index,
});

function Index() {
  const [entered, setEntered] = useState(false);
  const audioRef = useRef<AmbientAudioHandle>(null);

  return (
    <>
      <Prelude
        onEnter={() => {
          setEntered(true);
          // Start in the same user gesture so autoplay policies allow music.
          audioRef.current?.start();
        }}
      />
      <AmbientAudio ref={audioRef} enabled={entered} />
      <Toaster position="top-center" />

      <main
        className="relative"
        aria-hidden={!entered}
        style={{ opacity: entered ? 1 : 0, transition: "opacity 2.4s var(--ease-breath)" }}
      >
        <h1 className="sr-only">{title}</h1>
        <VerseScene active={entered} />
        <DoorwayScene />
        <GardenScene />
        <SoulsScene />
        <AnnouncementScene />
        <CelestialClock />
        <VenueScene />
        <RsvpScene />
        <BlessingScene />
        <footer className="pb-16 text-center">
          <p className="eyebrow">
            {invitation.venue} · {invitation.city}
          </p>
        </footer>
      </main>
    </>
  );
}
