import { trackLandingEvent } from "../analytics";
import { APP_URL, buildAppUrl } from "../config";
import { media } from "../media";
import { DIVE_CENTRES_PATH, HOME_PATH, Link, useRoutePath } from "../router";

export function Nav() {
  const path = useRoutePath();
  const onDiveCentres = path === DIVE_CENTRES_PATH;

  function handleTrySteve() {
    trackLandingEvent("open_scuba_steve_clicked", {
      source_section: "nav",
      cta_label: "Try Scuba Steve",
      outbound_url_host: new URL(APP_URL, window.location.href).host,
      visitor_type_signal: "diver"
    });
    window.location.href = buildAppUrl("nav");
  }

  return (
    <nav className="nav" aria-label="Primary">
      <Link to={HOME_PATH} className="brand" aria-label="Scuba Steve AI home">
        <img src={media.brand.oseaLogo.src} alt="" width="38" height="38" />
        <span>Scuba Steve AI</span>
      </Link>
      <div className="nav-links">
        <Link
          to={DIVE_CENTRES_PATH}
          className={`nav-link ${onDiveCentres ? "is-active" : ""}`}
          onNavigate={() =>
            trackLandingEvent("dive_centre_pilot_clicked", {
              source_section: "nav",
              cta_label: "Dive Centres"
            })
          }
        >
          Dive Centres
        </Link>
        <button className="nav-button" onClick={handleTrySteve}>
          <span className="nav-cta-long">Try Scuba Steve</span>
          <span className="nav-cta-short">Try Steve</span>
        </button>
      </div>
    </nav>
  );
}
