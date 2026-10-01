import { useEffect } from "react";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { DiveCentresPage } from "./pages/DiveCentresPage";
import { DIVE_CENTRES_PATH } from "./router";
import { pilotMeta, updateRouteMetadata } from "./seo";

export default function App() {
  useEffect(() => {
    if (window.location.pathname === "/") window.history.replaceState({}, "", DIVE_CENTRES_PATH + window.location.search + window.location.hash);
    updateRouteMetadata(true, pilotMeta.title, pilotMeta.description);
  }, []);
  return <div className="site-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <Nav />
    <DiveCentresPage />
    <Footer showEnquiryForm={false} />
  </div>;
}
