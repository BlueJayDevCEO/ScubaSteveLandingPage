import { useEffect, useState } from "react";
import { trackLandingEvent } from "../analytics";
import { APP_URL, buildAppUrl } from "../config";

/**
 * Slim, dismissible mobile-only CTA (strategy §15). Appears after the visitor
 * scrolls past the demo section so it never competes with the hero. CSS gates
 * it to small screens (.sticky-cta display:none until .is-visible, and the
 * bar itself is only shown at mobile widths via the media query in styles.css).
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const target = document.getElementById("demo");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Show once the demo section has scrolled out of the top of the viewport.
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            setVisible(true);
          }
        });
      },
      { threshold: 0 }
    );
    io.observe(target);
    return () => io.disconnect();
  }, [dismissed]);

  if (dismissed || !visible) return null;

  function open() {
    trackLandingEvent("open_scuba_steve_clicked", {
      source_section: "sticky",
      cta_label: "Try Scuba Steve",
      outbound_url_host: new URL(APP_URL, window.location.href).host,
      visitor_type_signal: "diver"
    });
    window.location.href = buildAppUrl("sticky");
  }

  return (
    <div className="sticky-cta is-visible" role="region" aria-label="Try Scuba Steve">
      <span>Ready to dive in?</span>
      <button className="primary-cta" onClick={open}>
        Try Scuba Steve
      </button>
      <button className="sticky-cta-dismiss" aria-label="Dismiss" onClick={() => setDismissed(true)}>
        ×
      </button>
    </div>
  );
}
