import { useEffect } from "react";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { StickyCta } from "./components/StickyCta";
import { DiveCentresPage } from "./pages/DiveCentresPage";
import { HomePage } from "./pages/HomePage";
import { DIVE_CENTRES_PATH, useRoutePath } from "./router";
import { pilotMeta, updateRouteMetadata } from "./seo";

const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Scuba Steve AI — Your AI Dive Buddy for Trip Planning, Marine ID & Dive Sites",
    description:
      "Scuba Steve is an AI assistant built specifically for divers. Plan dive trips, identify marine life, research dive sites and refresh your skills — before, between and after dives."
  },
  [DIVE_CENTRES_PATH]: {
    title: "Dive Centre Pilot — Scuba Steve AI for Dive Shops",
    description:
      "What if Steve knew your dive centre? A pilot for selected dive shops: a Steve configured around your courses, prices, schedules and local sites — answering customer questions and handing qualified enquiries to your team."
  }
};

export default function App() {
  const path = useRoutePath();
  const isDiveCentres = path === DIVE_CENTRES_PATH;

  useEffect(() => {
    const meta = ROUTE_META[isDiveCentres ? DIVE_CENTRES_PATH : "/"];
    updateRouteMetadata(isDiveCentres, isDiveCentres ? pilotMeta.title : meta.title, isDiveCentres ? pilotMeta.description : meta.description);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [isDiveCentres]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      {isDiveCentres ? <DiveCentresPage /> : <HomePage />}
      <Footer showEnquiryForm={!isDiveCentres} />
      {!isDiveCentres && <StickyCta />}
    </div>
  );
}
