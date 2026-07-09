import { useEffect, useState } from "react";
import { trackLandingEvent, trackLandingEventOncePerSession } from "../analytics";
import { BeforeAfterSlider } from "../components/BeforeAfterSlider";
import { DemoShowcase } from "../components/DemoShowcase";
import { Faq } from "../components/Faq";
import { HeroDemo } from "../components/HeroDemo";
import { Reveal } from "../components/Reveal";
import { APP_URL, buildAppUrl } from "../config";
import { media } from "../media";
import { DIVE_CENTRES_PATH, Link } from "../router";

const MOMENTS = [
  { demo: "trip-planner", title: "Booked a trip?", text: "Turn a destination idea into an itinerary, operator questions and a packing list." },
  { demo: "marine-id", title: "Saw something amazing?", text: "Get a marine life identification starting point from your dive photo." },
  { demo: "dive-sites", title: "Heading to a new site?", text: "Know the conditions, entries and highlights before you giant-stride in." },
  { demo: "refresh", title: "Been dry for months?", text: "Refresh skills and theory before you're back in the water." }
];

const CAPABILITIES = [
  { name: "Chat with Steve", text: "Plain-language diving questions, answered with diving context — not generic web summaries." },
  { name: "Dive Trip Planner", text: "Destination shapes, day-by-day structure, operator questions and logistics worth checking." },
  { name: "Marine ID", text: "Photo-based species identification starting points with habitat and behaviour context." },
  { name: "Dive Site Research", text: "Conditions, depth ranges, entries and what a site is actually known for." },
  { name: "Photo Color Fix", text: "One-tap underwater colour correction that brings the reds back to your dive photos." },
  { name: "Knowledge Refresh", text: "Structured refreshers on buoyancy, gas planning, signals and gear before you dive again." }
];

const HOW_STEPS = [
  {
    n: "01",
    title: "Ask, or drop in a photo",
    text: "A trip idea, a fish you can't place, a site you're about to dive, or “what should I refresh?”"
  },
  {
    n: "02",
    title: "Steve answers in diving context",
    text: "Structured trip plans, marine ID starting points, site briefs and refreshers — not generic web summaries."
  },
  {
    n: "03",
    title: "Take it to the water",
    text: "Save it, refine it, and always follow your certified training and the local briefing on the day."
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
  window.location.href = buildAppUrl(sourceSection);
}

export function HomePage() {
  const [demoTab, setDemoTab] = useState("trip-planner");

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
    trackLandingEvent("hero_try_steve_clicked", { source_section: "hero", cta_label: "Try Scuba Steve" });
    launchApp("hero", "Try Scuba Steve");
  }

  function handleHeroCapabilities() {
    trackLandingEvent("hero_capabilities_clicked", { source_section: "hero", cta_label: "See Steve in action" });
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openMomentDemo(demo: string) {
    setDemoTab(demo);
    trackLandingEvent("feature_selected", { source_section: "moments", feature: demo });
    trackLandingEvent("product_demo_started", { demo_id: demo, source_section: "moments" });
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main id="main">
      {/* 1. HERO */}
      <header className="hero" aria-labelledby="hero-heading">
        <div className="hero-media" aria-hidden="true">
          <img src={media.hero.background.src} alt="" {...{ fetchpriority: "high" }} decoding="async" />
        </div>
        <div className="hero-bubbles" aria-hidden="true">
          <span /><span /><span /><span /><span /><span />
        </div>
        <div className="hero-content">
          <p className="eyebrow">Built for divers, not for everything</p>
          <h1 id="hero-heading">
            Your AI dive buddy.
            <br />
            <span className="hero-accent">Before, between and after dives.</span>
          </h1>
          <p className="subheadline">
            Plan trips, identify marine life, research dive sites and refresh your skills — with an assistant
            built only for diving.
          </p>
          <div className="cta-row hero-actions">
            <button className="primary-cta primary-cta-strong" onClick={handleHeroTry}>
              Try Scuba Steve
            </button>
            <button className="secondary-cta" onClick={handleHeroCapabilities}>
              See Steve in action
            </button>
          </div>
          <p className="hero-microcopy">
            Free to start. A planning and learning buddy — never a replacement for training or local briefings.
          </p>
        </div>
        <div className="hero-visual">
          <HeroDemo />
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
            <Reveal key={moment.title} delay={(index % 4) as 0 | 1 | 2 | 3}>
              <button type="button" className="moment" onClick={() => openMomentDemo(moment.demo)}>
                <h3>{moment.title}</h3>
                <p>{moment.text}</p>
                <span className="moment-cue" aria-hidden="true">See it in action →</span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 2b. HOW IT WORKS */}
      <section className="how-section" aria-labelledby="how-heading">
        <Reveal>
          <p className="eyebrow">How Steve works</p>
          <h2 id="how-heading">Three steps, on land or between dives.</h2>
        </Reveal>
        <ol className="how-steps">
          {HOW_STEPS.map((step, index) => (
            <Reveal as="div" key={step.n} delay={(index % 3) as 0 | 1 | 2} className="how-step">
              <li>
                <span className="how-step-n" aria-hidden="true">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* 3. STEVE IN ACTION */}
      <section id="demo" className="demo-section" aria-labelledby="demo-heading">
        <Reveal>
          <p className="eyebrow">Steve in action</p>
          <h2 id="demo-heading">Ask like a diver. Get answers like a dive buddy.</h2>
        </Reveal>
        <Reveal delay={1}>
          <DemoShowcase activeId={demoTab} onSelect={setDemoTab} />
        </Reveal>
      </section>

      {/* 4. COLOR FIX */}
      <section className="colorfix-section" aria-labelledby="colorfix-heading">
        <div className="colorfix-inner">
          <Reveal>
            <p className="eyebrow">One tap, real photo</p>
            <h2 id="colorfix-heading">Bring the reds back.</h2>
            <p className="section-lede" style={{ marginInline: "auto" }}>
              Underwater, water eats the warm colours first. Drag across this real dive photo to see
              underwater colour correction bring them back.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <BeforeAfterSlider
              beforeSrc={media.product.colorFixBefore.src}
              afterSrc={media.product.colorFixAfter.src}
              beforeAlt={media.product.colorFixBefore.alt}
              afterAlt={media.product.colorFixAfter.alt}
            />
          </Reveal>
          <Reveal delay={2}>
            <a
              className="colorfix-link"
              href={buildAppUrl("color_fix")}
              onClick={() =>
                trackLandingEvent("open_scuba_steve_clicked", {
                  source_section: "color_fix",
                  cta_label: "Fix one of yours",
                  visitor_type_signal: "diver"
                })
              }
            >
              Fix one of yours → Try Scuba Steve
            </a>
          </Reveal>
        </div>
      </section>

      {/* 5. CAPABILITIES */}
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
              src={media.product.marineId.src}
              alt="Diver photographing reef marine life for identification in Scuba Steve"
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

      {/* 6. WHY DIVING-SPECIFIC */}
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

      {/* 7. TRUST & FOUNDER */}
      <section className="trust-section" aria-labelledby="trust-heading">
        <Reveal>
          <p className="eyebrow">Where Steve fits</p>
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
        <Reveal className="founder-strip">
          <p className="founder-name">Built by a diver, for divers</p>
          <p>
            Scuba Steve is built by Jay Van der Colff, a diving instructor and founder of OSEA Diver. Steve
            exists because the questions divers ask don't stop when the dive ends.
          </p>
          <a
            className="founder-challenge"
            href={buildAppUrl("trust")}
            onClick={() =>
              trackLandingEvent("open_scuba_steve_clicked", {
                source_section: "trust",
                cta_label: "Ask Steve something hard",
                visitor_type_signal: "diver"
              })
            }
          >
            Don't take our word for it — ask Steve something hard from your own diving →
          </a>
        </Reveal>
      </section>

      {/* 8. DIVE CENTRE TEASER */}
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

      {/* 9. FAQ */}
      <section id="faq" className="faq-section" aria-labelledby="faq-heading">
        <Reveal>
          <p className="eyebrow dark-eyebrow">Common questions</p>
          <h2 id="faq-heading">Straight answers about what Steve does.</h2>
        </Reveal>
        <Reveal delay={1}>
          <Faq />
        </Reveal>
      </section>

      {/* 9b. PRICING */}
      <section className="pricing-strip" aria-labelledby="pricing-heading">
        <Reveal>
          <p className="eyebrow">Pricing</p>
          <h2 id="pricing-heading">Free to start.</h2>
          <p className="section-lede">
            Scuba Steve is free to use, with generous daily limits. Diving often? Pro lifts the limits across
            every tool.
          </p>
        </Reveal>
        <div className="pricing-tiers">
          <Reveal className="pricing-tier">
            <h3>
              Free <span className="tier-price">$0</span>
            </h3>
            <p>
              Daily use of chat, marine ID, trip planning, site research and refreshers — enough to really put
              Steve to work. No card to start.
            </p>
          </Reveal>
          <Reveal delay={1} className="pricing-tier">
            <h3>
              Pro <span className="tier-price">Subscription</span>
            </h3>
            <p>
              For frequent divers — higher daily limits across every tool. Upgrade in the app whenever you're
              ready.
            </p>
          </Reveal>
        </div>
        <Reveal>
          <div className="cta-row" style={{ justifyContent: "center", marginTop: 28 }}>
            <button
              className="primary-cta primary-cta-strong"
              onClick={() => {
                trackLandingEvent("final_cta_clicked", {
                  source_section: "pricing",
                  cta_label: "Try Scuba Steve free",
                  audience: "diver"
                });
                launchApp("pricing", "Try Scuba Steve free");
              }}
            >
              Try Scuba Steve free
            </button>
          </div>
        </Reveal>
      </section>

      {/* 10. FINAL CTA */}
      <section id="final-cta" className="final-cta" aria-labelledby="final-heading">
        <Reveal>
          <h2 id="final-heading">Your next dive starts with a question.</h2>
        </Reveal>
        <div className="final-split">
          <Reveal className="final-panel final-panel-diver">
            <h3>Divers</h3>
            <p>Plan, identify, research and refresh — all in one place.</p>
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
            <p className="final-reassure">No card, no commitment.</p>
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
