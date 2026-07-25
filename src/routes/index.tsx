import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { AmbientAudio } from "@/components/invitation/AmbientAudio";
import { invitation } from "@/components/invitation/data";

const title = `${invitation.groom} & ${invitation.bride} — Nikah Invitation`;
const description = `With hearts full of gratitude, Amal & Minsha invite you to their Nikah on ${invitation.dayName}, ${invitation.monthName} ${invitation.day}, ${invitation.year} at ${invitation.venue}, ${invitation.city}.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      <Prelude onEnter={() => setEntered(true)} />
      <AmbientAudio />
      <Toaster position="top-center" />

      <main
        className="relative"
        aria-hidden={!entered}
        style={{ opacity: entered ? 1 : 0, transition: "opacity 2.4s var(--ease-breath)" }}
      >
        <h1 className="sr-only">{title}</h1>
        <VerseScene />
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
