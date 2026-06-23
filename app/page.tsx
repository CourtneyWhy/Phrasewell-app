import type { Metadata } from "next";
import { LandingPage } from "@/app/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Phrasewell — Know what to say when the moment gets hard",
  description:
    "Calm scripts, simple next steps, and helpful notes for foster, adoptive, kinship, and overwhelmed parents.",
};

export default function Home() {
  return <LandingPage />;
}
