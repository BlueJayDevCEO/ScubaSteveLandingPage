import { useEffect } from "react";
import { trackLandingEvent, trackLandingEventOncePerSession } from "../analytics";
import { DemoShowcase } from "../components/DemoShowcase";
import { Reveal } from "../components/Reveal";
import { APP_URL } from "../config";
import { media } from "../media";
import { DIVE_CENTRES_PATH, Link } from "../router";

const MOMENTS = [
  {
    title: "Booked a trip?",
    text: "Turn a destination idea into an itinerary, operator questions and a packing list."
  },
  {
    title: "Saw something amazing?",
    text: "Get a marine life identification starting point from your dive photo."
  },
  {
    title: "Heading to a new site?",
    text: "Know the conditions, entries and highlights before you giant-stride in."
  },
  {
    title: "Been dry for months?",
    text: "Refresh skills and theory before you're back in the water."
  }
];

const CAPABILITIES = [
  {
    name: "Chat with Steve",
    text: "Plain-language diving questions, answered with diving context — not generic web summaries."
  },
  {
    name: "Dive Trip Planner",
    text: "Destination shapes, day-by-day structure, operator questions and logistics worth checking."
  },
  {
    name: "Marine ID",
    text: "Photo-based species identification starting points with habitat and behaviour context."
  },
  {
    name: "Dive Site Research",
    text: "Conditions, depth ranges, entries and what a site is actually known for."
  },
  {
    name: "Photo Color Fix",
    text: "One-tap underwater colour correction that brings the reds back to your dive photos."
  },
  {
    name: "Knowledge Refresh",
    text: "Structured refreshers on buoyancy, gas planning, signals and gear before you dive again."
  }
];

const STEVE_IS = [
  "A planning and preparation assistant",
  "A marine life learning companion",
  "A dive-site research starting point",
  "A knowledge refresher between dives"
];

const STEVE_IS_NOT = [
  "A replacement for instructors or dive professionals",
  "A source of medical advice",
  "A substitute for local briefings and conditions checks",
  "An emergency resource — always follow your training"
];

const sectionTrackingEvents = [
  { selector: "#moments", eventName: "reached_problem_section", section: "moments" },
  { selector: "#demo", eventName: "reached_solution_section", section: "demo" },
  { selector: "#dive-centres-teaser", eventName: "dive_centre_section_viewed", section: "dive_centre_teaser" },
  { selector: "#final-cta", eventName: "reached_final_cta_section", section: "final_cta" }
];

function launchApp(sourceSection: string, ctaLabel: string, extra: Record<string, string> = {}) {
  trackLandingEvent("open_scuba_steve_clicked", {
    source_section: sourceSection,
    cta_label: ctaLabel,
    outbound_url_host: new URL(APP_URL, window.location.href).host,
    visitor_type_signal: "diver",
    ...extra
  });
  window.location.href = APP_URL;
}

export function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = sectionTrackingEvents.find((item) => entry.target.matches(item.selector));
          if (!section) return;
          trackLandingEventOncePerSession(section.eventName, { source_section: section.section });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    sectionTrackingEvents.forEach(({ selector }) => {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  function handleHeroTry() {
    trackLandingEvent("hero_try_steve_clicked", {
      source_section: "hero",
      cta_label: "Try Scuba Steve"
    });
    launchApp("hero", "Try Scuba Steve");
  }

  function handleHeroCapabilities() {
    trackLandingEvent("hero_capabilities_clicked", {
      source_section: "hero",
      cta_label: "See what Steve can do"
    });
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main id="main">
      {/* 1. HERO */}
      <header className="hero" aria-labelledby="hero-heading">
        <div className="hero-media" aria-hidden="true">
          <img src={media.hero.background.src} alt="" fetchPriority="high" decoding="async" />
        </div>
        <div className="hero-content">
          <p className="eyebrow">Built for divers, not for everything</p>
          <h1 id="hero-heading">
            Your AI dive buddy.
            <br />
            <span className="hero-accent">Before, between and after dives.</span>
          </h1>
          <p className="subheadline">
            Scuba Steve is an AI assistant built specifically around diving — plan trips, identify marine
            life, research dive sites and refresh your skills, all in one place.
          </p>
          <div className="cta-row hero-actions">
            <button className="primary-cta primary-cta-strong" onClick={handleHeroTry}>
              Try Scuba Steve
            </button>
            <button className="secondary-cta" onClick={handleHeroCapabilities}>
              See what Steve can do
            </button>
          </div>
          <p className="hero-microcopy">
            Free to start. Planning and learning support — never a replacement for training or local briefings.
          </p>
        </div>
        <div className="hero-visual">
          <div className="hero-steve-frame">
            <img src={media.product.stevePortrait.src} alt="Steve, the Scuba Steve AI dive buddy" />
          </div>
          <div className="hero-chat-chip" aria-hidden="true">
            <span className="hero-chat-q">“What did I just see at 18 metres?”</span>
            <span className="hero-chat-a">Send me the photo — let's find out.</span>
          </div>
        </div>
      </header>

      {/* 2. MOMENTS */}
      <section id="moments" className="moments-section" aria-labelledby="moments-heading">
        <Reveal>
          <p className="eyebrow dark-eyebrow">The moments that matter</p>
          <h2 id="moments-heading">Most of diving happens on land.</h2>
          <p className="section-lede">
            The questions come before the trip, after the dive, and in the months between. That's where Steve lives.
          </p>
        </Reveal>
        <div className="moments-grid">
          {MOMENTS.map((moment, index) => (
            <Reveal key={moment.title} delay={(index % 4) as 0 | 1 | 2 | 3} className="moment">
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3. PRODUCT EXPERIENCE */}
      <section id="demo" className="demo-section" aria-labelledby="demo-heading">
        <Reveal>
          <p className="eyebrow">Steve in action</p>
          <h2 id="demo-heading">Ask like a diver. Get answers like a dive buddy.</h2>
        </Reveal>
        <Reveal delay={1}>
          <DemoShowcase />
        </Reveal>
      </section>

      {/* 4. CORE CAPABILITIES */}
      <section className="capabilities-section" aria-labelledby="capabilities-heading">
        <div className="capabilities-intro">
          <Reveal>
            <p className="eyebrow dark-eyebrow">What Steve does</p>
            <h2 id="capabilities-heading">One assistant. The whole dive cycle.</h2>
            <p className="section-lede">
              Six focused tools, built around how divers actually prepare, dive and remember.
            </p>
          </Reveal>
          <Reveal delay={1} className="capabilities-visual">
            <img
              src={media.product.photoEnhancement.src}
              alt="Before and after underwater photo colour correction in Scuba Steve"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        </div>
        <div className="capabilities-list">
          {CAPABILITIES.map((capability, index) => (
            <Reveal key={capability.name} delay={(index % 3) as 0 | 1 | 2} className="capability">
              <h3>{capability.name}</h3>
              <p>{capability.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. WHY DIVING-SPECIFIC */}
      <section className="why-section" aria-labelledby="why-heading">
        <div className="why-media" aria-hidden="true">
          <img src={media.backgrounds.coralGarden.src} alt="" loading="lazy" decoding="async" />
        </div>
        <Reveal className="why-content">
          <p className="eyebrow">Why not just any chatbot?</p>
          <h2 id="why-heading">Generic AI knows a bit about everything. Steve knows diving.</h2>
          <div className="why-points">
            <div>
              <h3>Speaks diving</h3>
              <p>
                Nitrox, surface intervals, ragged-tooth season, no-fly windows — Steve is built around diving
                vocabulary and context, so you don't have to explain the basics before asking your question.
              </p>
            </div>
            <div>
              <h3>Structured dive workflows</h3>
              <p>
                Trip planning, marine ID, site research and refreshers are purpose-built flows — not one chat
                box trying to be everything.
              </p>
            </div>
            <div>
              <h3>Safety-aware by design</h3>
              <p>
                Steve consistently points you back to certified training, local operators and professional
                judgement where they belong.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 6. SAFETY AND TRUST */}
      <section className="trust-section" aria-labelledby="trust-heading">
        <Reveal>
          <p className="eyebrow dark-eyebrow">Where Steve fits</p>
          <h2 id="trust-heading">A dive buddy, not a dive professional.</h2>
        </Reveal>
        <div className="trust-columns">
          <Reveal className="trust-col trust-col-is">
            <h3>Steve is</h3>
            <ul>
              {STEVE_IS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={1} className="trust-col trust-col-not">
            <h3>Steve is not</h3>
            <ul>
              {STEVE_IS_NOT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 7. DIVE CENTRE TEASER */}
      <section id="dive-centres-teaser" className="b2b-teaser" aria-labelledby="b2b-heading">
        <Reveal className="b2b-teaser-content">
          <p className="eyebrow b2b-eyebrow">For dive centres — pilot programme</p>
          <h2 id="b2b-heading">What if Steve knew your dive centre?</h2>
          <p>
            We're piloting shop-specific assistants with selected dive centres: a Steve configured around your
            courses, prices, schedules, trips, local sites, rental gear and policies — answering customer
            questions and handing qualified enquiries to your team.
          </p>
          <Link
            to={DIVE_CENTRES_PATH}
            className="primary-cta b2b-cta"
            onNavigate={() =>
              trackLandingEvent("dive_centre_pilot_clicked", {
                source_section: "home_teaser",
                cta_label: "Explore the Dive Centre Pilot"
              })
            }
          >
            Explore the Dive Centre Pilot
          </Link>
        </Reveal>
      </section>

      {/* 8. FINAL CTA */}
      <section id="final-cta" className="final-cta" aria-labelledby="final-heading">
        <Reveal>
          <h2 id="final-heading">Your next dive starts with a question.</h2>
        </Reveal>
        <div className="final-split">
          <Reveal className="final-panel final-panel-diver">
            <h3>Divers</h3>
            <p>Plan, identify, research and refresh — free to start.</p>
            <button
              className="primary-cta primary-cta-strong"
              onClick={() => {
                trackLandingEvent("final_cta_clicked", {
                  source_section: "final",
                  cta_label: "Try Scuba Steve",
                  audience: "diver"
                });
                launchApp("final", "Try Scuba Steve");
              }}
            >
              Try Scuba Steve
            </button>
          </Reveal>
          <Reveal delay={1} className="final-panel final-panel-business">
            <h3>Dive centres</h3>
            <p>A shop-specific Steve, configured around your business.</p>
            <Link
              to={DIVE_CENTRES_PATH}
              className="secondary-cta b2b-outline-cta"
              onNavigate={() => {
                trackLandingEvent("final_cta_clicked", {
                  source_section: "final",
                  cta_label: "Explore the Dive Centre Pilot",
                  audience: "business"
                });
                trackLandingEvent("dive_centre_pilot_clicked", {
                  source_section: "final",
                  cta_label: "Explore the Dive Centre Pilot"
                });
              }}
            >
              Explore the Dive Centre Pilot
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
