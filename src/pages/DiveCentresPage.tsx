import { useEffect } from "react";
import { trackLandingEventOncePerSession } from "../analytics";
import { EnquiryActions } from "../components/EnquiryActions";
import { PilotForm } from "../components/PilotForm";
import { Reveal } from "../components/Reveal";
import { ShopConversation } from "../components/ShopConversation";
import { enquiryMailto } from "../enquiry";
import { media } from "../media";

const OWNER_FAQ = [
  {
    q: "Where does Steve get its answers?",
    a: "Only from the information you approve — your courses, prices, schedules, sites and policies — plus Steve's general diving context. It does not invent shop-specific details."
  },
  {
    q: "What if it doesn't know something?",
    a: "It says so plainly and hands the customer off to your team through your configured contact path, rather than guessing."
  },
  {
    q: "How much effort is setup?",
    a: "You provide the shop information; we configure your Steve around it. There's nothing to install or code on your side."
  },
  {
    q: "What does the pilot cost?",
    a: "Pilot terms are discussed personally with each shop — tell us about your business and we'll talk specifics by email."
  },
  {
    q: "Can we review it before customers see it?",
    a: "Yes. Reviewing how your Steve answers is a required step before anything goes live — that's step three of the pilot."
  }
];

const SHOP_KNOWLEDGE = [
  "Courses, prerequisites and pricing",
  "Schedules and trip calendars",
  "Local dive sites and seasonal conditions",
  "Rental gear and what's included",
  "Policies, deposits and cancellation terms",
  "FAQs your team answers every week",
  "Contact paths and enquiry handoff"
];

const CUSTOMER_QUESTIONS = [
  "“Do I need a licence to try diving with you?”",
  "“What courses run in July, and what do they cost?”",
  "“I'm certified but haven't dived in two years — what do I need?”",
  "“Can my kids snorkel while I dive?”",
  "“What's included in the rental package?”",
  "“Which of your sites suit a nervous open-water diver?”"
];

const PILOT_SCOPE = [
  "Shop information, courses and trip details",
  "Local dive-site knowledge",
  "Prerequisites, rental and policy answers",
  "FAQ handling in diving context",
  "Lead capture and qualification",
  "Contact or WhatsApp handoff to your team"
];

const NOT_YET = [
  "Booking-system integration",
  "Live availability",
  "Payment processing",
  "Deep CRM workflows"
];

const PILOT_STEPS = [
  {
    title: "Apply",
    text: "Tell us about your shop and the questions your team answers most often."
  },
  {
    title: "Configure",
    text: "You provide the shop information — courses, prices, schedules, sites, policies. We configure your Steve around it."
  },
  {
    title: "Review",
    text: "You review how your Steve answers before anything goes near a customer."
  },
  {
    title: "Go live and learn",
    text: "Customers ask, Steve answers from your information, and qualified enquiries hand off to your team through your configured contact path."
  }
];

export function DiveCentresPage() {
  useEffect(() => {
    trackLandingEventOncePerSession("dive_centre_page_viewed", {
      source_section: "dive_centres_page"
    });
    trackLandingEventOncePerSession("dive_centre_section_viewed", {
      source_section: "dive_centres_page"
    });
  }, []);

  function scrollToApply() {
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main id="main" className="b2b-page">
      {/* B2B hero */}
      <header className="b2b-hero" aria-labelledby="b2b-hero-heading">
        <div className="b2b-hero-media" aria-hidden="true">
          <img src={media.backgrounds.wreck.src} alt="" {...{ fetchpriority: "high" }} decoding="async" />
        </div>
        <div className="b2b-hero-content">
          <p className="eyebrow b2b-eyebrow">Dive Centre Pilot Programme</p>
          <h1 id="b2b-hero-heading">
            Your dive centre already has the answers.
            <br />
            <span className="hero-accent">Steve helps customers find them.</span>
          </h1>
          <p className="subheadline">
            A pilot programme for selected dive centres: a shop-specific AI assistant configured around your
            courses, schedules, sites and policies — answering customer questions and handing qualified
            enquiries to your team.
          </p>
          <div className="cta-row">
            <button className="primary-cta primary-cta-strong b2b-cta" onClick={scrollToApply}>
              Apply for the pilot
            </button>
          </div>
          <p className="hero-microcopy">
            Pilot programme — limited configuration slots, reviewed personally.
          </p>
        </div>
      </header>

      {/* The business problem */}
      <section className="b2b-problem" aria-labelledby="b2b-problem-heading">
        <Reveal>
          <p className="eyebrow dark-eyebrow">The problem</p>
          <h2 id="b2b-problem-heading">Your team answers the same questions every day.</h2>
          <p className="section-lede">
            Course prices. Prerequisites. What's included in a rental. Whether a nervous open-water diver can
            handle your house reef. Every one matters to the customer — and every one takes your staff away
            from the boat, the shop floor and the students in front of them. After hours, those questions go
            unanswered entirely.
          </p>
        </Reveal>
      </section>

      {/* What Dive Shop Steve is */}
      <section id="example" className="b2b-what" aria-labelledby="b2b-what-heading">
        <div className="b2b-what-grid">
          <Reveal className="b2b-what-content">
            <p className="eyebrow dark-eyebrow">The pilot concept</p>
            <h2 id="b2b-what-heading">What is Dive Shop Steve?</h2>
            <p>
              Scuba Steve already understands diving — trip planning, marine life, sites, training context. The
              pilot adds what generic assistants can never have: <strong>your shop's actual information.</strong>
            </p>
            <p>
              A shop-specific Steve is configured around what you provide, and answers customers from it — in
              diving context, with your contact path as the handoff.
            </p>
            <h3 className="b2b-list-heading">What your Steve can know</h3>
            <ul className="b2b-checklist">
              {SHOP_KNOWLEDGE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={1} className="b2b-questions">
            <h3>What customers can ask</h3>
            <ul className="b2b-question-list">
              {CUSTOMER_QUESTIONS.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal>
          <ShopConversation />
        </Reveal>
      </section>

      {/* Customer journey */}
      <section id="how-it-works" className="b2b-journey" aria-labelledby="b2b-journey-heading">
        <Reveal>
          <p className="eyebrow b2b-eyebrow">How an enquiry flows</p>
          <h2 id="b2b-journey-heading">From question to qualified enquiry.</h2>
        </Reveal>
        <ol className="journey-steps">
          <Reveal as="div" className="journey-step">
            <li>
              <strong>A visitor asks a question</strong>
              <span>On the channel where your Steve is configured.</span>
            </li>
          </Reveal>
          <Reveal as="div" delay={1} className="journey-step">
            <li>
              <strong>Steve answers from your information</strong>
              <span>Your courses, prices, sites and policies — inside real diving context.</span>
            </li>
          </Reveal>
          <Reveal as="div" delay={2} className="journey-step">
            <li>
              <strong>Steve qualifies the enquiry</strong>
              <span>Certification level, dates, group size — the details your team needs.</span>
            </li>
          </Reveal>
          <Reveal as="div" delay={3} className="journey-step">
            <li>
              <strong>Your team takes over</strong>
              <span>Handoff through your configured contact path — email, WhatsApp or enquiry form.</span>
            </li>
          </Reveal>
        </ol>
      </section>

      {/* How the pilot works */}
      <section className="b2b-pilot" aria-labelledby="b2b-pilot-heading">
        <Reveal>
          <p className="eyebrow dark-eyebrow">The pilot, step by step</p>
          <h2 id="b2b-pilot-heading">How the pilot works.</h2>
        </Reveal>
        <div className="pilot-steps">
          {PILOT_STEPS.map((step, index) => (
            <Reveal key={step.title} delay={(index % 4) as 0 | 1 | 2 | 3} className="pilot-step">
              <span className="pilot-step-number" aria-hidden="true">
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
        </div>

        <div id="scope" className="pilot-scope-grid">
          <Reveal className="pilot-scope">
            <h3>In the pilot</h3>
            <ul className="b2b-checklist">
              {PILOT_SCOPE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={1} className="pilot-scope pilot-scope-not">
            <h3>Not included yet</h3>
            <ul className="b2b-crosslist">
              {NOT_YET.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="pilot-future-note">
              These are future possibilities we're exploring with pilot partners — we'll only describe them as
              features when they actually exist.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Shop-owner FAQ */}
      <section className="b2b-pilot" aria-labelledby="b2b-owner-faq-heading">
        <Reveal>
          <p className="eyebrow dark-eyebrow">Questions dive-centre owners ask</p>
          <h2 id="b2b-owner-faq-heading">Before you apply.</h2>
        </Reveal>
        <Reveal delay={1} className="b2b-owner-faq">
          <div className="faq-list">
            {OWNER_FAQ.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Application */}
      <section id="apply" className="b2b-apply" aria-labelledby="b2b-apply-heading">
        <Reveal>
          <p className="eyebrow b2b-eyebrow">Application</p>
          <h2 id="b2b-apply-heading">Apply for the Dive Centre Pilot.</h2>
          <p className="section-lede">
            Tell us about your shop. We review applications personally and reply by email — no automated
            sales sequence.
          </p>
        </Reveal>
        <Reveal delay={1}>
          <PilotForm />
        </Reveal>
        <Reveal delay={1}>
          <p className="b2b-reply-note">
            Prefer email? Reply directly to the message that sent you here, or write to{" "}
            <a href={enquiryMailto("dive-centre")}>steve@scubasteve.rocks</a>.
          </p>
          <EnquiryActions kind="dive-centre" section="dive_centres_page" />
        </Reveal>
      </section>
    </main>
  );
}
