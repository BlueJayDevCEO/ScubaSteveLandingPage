import { useEffect, useRef } from "react";
import { trackLandingEventOncePerSession } from "../analytics";

/**
 * Example customer↔shop conversation for /dive-centres (strategy §17).
 * Static and explicitly labelled as using SAMPLE shop information — a real
 * shop's Steve answers only from what the shop approves.
 */
export function ShopConversation() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackLandingEventOncePerSession("pilot_example_viewed", { source_section: "dive_centres_page" });
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="shop-convo" ref={ref}>
      <div className="shop-convo-head">Example · with sample shop information</div>
      <div className="shop-convo-body">
        <div className="shop-msg shop-msg-customer">
          I'm certified but haven't dived in two years — can I join Saturday's boat?
        </div>
        <div className="shop-msg shop-msg-steve">
          Welcome back! After two years we ask divers to do a Reef Refresher first — it's a half-day, R850,
          and runs Saturday mornings before the afternoon boat. Do that and you're set for Saturday's 13:00
          departure to our house reef.
          <br />
          <span className="shop-handoff">↪ Continue on WhatsApp with Blue Horizon Divers</span>
        </div>
      </div>
      <p className="shop-convo-note">
        Sample answer using example shop information. Your Steve answers only from the courses, prices,
        schedules and policies you approve — and hands off through your own contact path.
      </p>
    </div>
  );
}
