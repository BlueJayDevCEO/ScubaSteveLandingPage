import { FormEvent, useEffect, useRef, useState } from "react";
import { trackLandingEvent, trackLandingEventOncePerSession } from "./analytics";
import { APP_URL } from "./config";
import { media } from "./media";
import { futureNavigationRoutes } from "./routes";

const problems = [
  "Identify what you saw after the dive",
  "Plan smarter questions before booking",
  "Review scuba basics between dives",
  "Make underwater photos easier to share"
];

const solutions = [
  {
    title: "Marine Life ID",
    text: "Turn a dive photo into a useful marine life identification starting point, with context you can check against local expertise.",
    image: media.product.marineId
  },
  {
    title: "AI Dive Questions",
    text: "Ask plain-language scuba questions when you want a quick, safety-aware learning refresh between dives.",
    image: media.product.aiChat
  },
  {
    title: "Dive Trip Planner",
    text: "Prepare destination ideas, operator questions, conditions to check, and next steps before you book.",
    image: media.product.tripPlanner
  },
  {
    title: "Underwater Photo Enhancement",
    text: "Improve color and clarity so sightings, memories, and learning moments are easier to review and share.",
    image: media.product.photoEnhancement
  }
];

const trustItems = [
  "Created from real scuba instruction experience",
  "Clear safety boundaries",
  "Built for real diver workflows",
  "Mobile-first for dive travel"
];

const diverUseContent = [
  "Scuba Steve AI is built for divers who want one focused AI scuba app for the moments that happen before, between, and after dives. After a reef dive, a diver might have a photo of a fish, ray, nudibranch, or coral scene and want a useful starting point for marine life identification. Instead of guessing from memory, Scuba Steve helps turn the image into a learning prompt with practical context. It is not a substitute for a marine biologist or local guide, but it can help divers ask better questions and remember what they saw underwater.",
  "Planning is the second major use. Divers can use Scuba Steve as a dive trip planner to think through destination ideas, operator questions, local conditions, travel logistics, and the details worth checking before booking. The goal is not to replace local briefings or professional judgement. It is to help divers prepare better questions before speaking with an instructor, dive centre, liveaboard, resort, or local operator.",
  "For scuba learning, Scuba Steve works as a plain-language scuba AI assistant. Divers can ask about concepts they want to review between dives, from buoyancy and currents to equipment checks and trip preparation. The tone stays practical and safety-aware, reinforcing that certified training, local dive professionals, dive computers, tables, emergency services, and personal judgement remain essential.",
  "Underwater photography is another common use. Water, depth, light loss, and suspended particles can make dive photos look flat or disappointing. Scuba Steve's underwater photo enhancement tools help divers review and improve images so sightings are easier to share, study, and remember. Together, marine life ID, dive planning, scuba answers, and photo tools make Scuba Steve a focused AI dive companion for real diver workflows.",
  "For dive businesses, instructors, and resorts, that simple positioning matters. Scuba Steve is easy to explain to customers because it supports the questions divers already bring to a dive centre: what they saw, where they want to go, what they want to understand, and how to make their underwater photos clearer."
];

const faqs = [
  {
    question: "What is Scuba Steve AI?",
    answer:
      "Scuba Steve AI is an AI scuba app for divers who want help with marine life identification, dive planning, scuba learning, and underwater photo enhancement."
  },
  {
    question: "Can Scuba Steve identify marine life from a dive photo?",
    answer:
      "Yes. Scuba Steve can help turn a dive photo into a marine life identification starting point, with practical context for divers and room for local expert confirmation."
  },
  {
    question: "Does Scuba Steve work as a dive trip planner?",
    answer:
      "Yes. As a dive planning assistant, Scuba Steve helps divers think through destination ideas, operator questions, local conditions, logistics, and planning steps before a trip."
  },
  {
    question: "Is Scuba Steve a scuba AI assistant for beginners?",
    answer:
      "Yes. Beginners can use Scuba Steve as a scuba AI assistant for plain-language questions and learning support, while still relying on certified training and professional instruction."
  },
  {
    question: "Can Scuba Steve help with underwater photo enhancement?",
    answer:
      "Yes. Scuba Steve includes underwater photo enhancement tools that help divers improve, review, and learn from underwater images."
  },
  {
    question: "Does Scuba Steve replace dive training or emergency services?",
    answer:
      "No. Scuba Steve supports learning and planning only. It does not replace certified training, dive professionals, local briefings, emergency services, or personal dive judgement."
  }
];

type SubmitState = "idle" | "loading" | "success" | "error";

const sectionTrackingEvents = [
  { selector: ".problem-section", eventName: "reached_problem_section", section: "problem" },
  { selector: ".solution-section", eventName: "reached_solution_section", section: "solution" },
  { selector: "#business-interest", eventName: "reached_business_section", section: "business" },
  { selector: "#faq", eventName: "reached_faq_section", section: "faq" },
  { selector: ".final-cta", eventName: "reached_final_cta_section", section: "final_cta" }
];

function launchApp(sourceSection: string, ctaLabel: string) {
  if (sourceSection === "hero") {
    trackLandingEvent("hero_cta_clicked", {
      source_section: sourceSection,
      cta_label: ctaLabel,
      visitor_type_signal: "diver"
    });
  }

  trackLandingEvent("open_scuba_steve_clicked", {
    source_section: sourceSection,
    cta_label: ctaLabel,
    outbound_url_host: new URL(APP_URL, window.location.href).host,
    visitor_type_signal: "diver"
  });
  window.location.href = APP_URL;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App() {
  const [businessState, setBusinessState] = useState<SubmitState>("idle");
  const [businessError, setBusinessError] = useState("");
  const futureTopicCount = futureNavigationRoutes.length;
  const hasStartedBusinessForm = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = sectionTrackingEvents.find((item) => entry.target.matches(item.selector));
          if (!section) return;
          trackLandingEventOncePerSession(section.eventName, {
            source_section: section.section
          });
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

  useEffect(() => {
    function handleExternalLinkClick(event: globalThis.MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin === window.location.origin || url.protocol === "mailto:" || url.protocol === "tel:") return;

      trackLandingEvent("external_link_clicked", {
        source_section: link.closest("section, footer, header, nav")?.id || link.closest("section, footer, header, nav")?.className?.toString() || "unknown",
        cta_label: link.textContent?.trim().slice(0, 80) || link.getAttribute("aria-label") || "external_link",
        outbound_url_host: url.host
      });
    }

    document.addEventListener("click", handleExternalLinkClick);
    return () => document.removeEventListener("click", handleExternalLinkClick);
  }, []);

  function trackBusinessFormStarted() {
    if (hasStartedBusinessForm.current) return;
    hasStartedBusinessForm.current = true;
    trackLandingEventOncePerSession("business_form_started", {
      source_section: "business",
      visitor_type_signal: "business"
    });
  }

  async function submitBusinessInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (businessState === "loading") return;
    setBusinessState("loading");
    setBusinessError("");

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      businessName: String(form.get("businessName") || ""),
      businessType: String(form.get("businessType") || ""),
      country: String(form.get("country") || ""),
      website: String(form.get("website") || ""),
      message: String(form.get("message") || ""),
      websiteUrl: String(form.get("websiteUrl") || "")
    };

    trackLandingEvent("business_form_submitted", {
      source_section: "business",
      cta_label: "Request Business Follow-Up",
      visitor_type_signal: "business",
      business_type: payload.businessType || "unspecified",
      has_website: payload.website ? "true" : "false",
      has_message: payload.message ? "true" : "false"
    });

    let trackedSubmitError = false;

    try {
      const response = await fetch("/api/business-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        trackLandingEvent("business_form_error", {
          source_section: "business",
          visitor_type_signal: "business",
          business_type: payload.businessType || "unspecified",
          error_type: "api_error",
          status_code: String(response.status)
        });
        trackedSubmitError = true;
        throw new Error("business_signup_failed");
      }

      event.currentTarget.reset();
      setBusinessState("success");
      trackLandingEvent("business_form_success", {
        source_section: "business",
        visitor_type_signal: "business",
        business_type: payload.businessType || "unspecified",
        has_website: payload.website ? "true" : "false",
        has_message: payload.message ? "true" : "false"
      });
    } catch {
      setBusinessState("error");
      setBusinessError("We could not register your interest right now. Please try again in a moment.");
      if (!trackedSubmitError) {
        trackLandingEvent("business_form_error", {
          source_section: "business",
          visitor_type_signal: "business",
          business_type: payload.businessType || "unspecified",
          error_type: "submit_failure"
        });
      }
    }
  }

  function openBusinessInterest(sourceSection: string, ctaLabel: string) {
    if (sourceSection === "hero") {
      trackLandingEvent("hero_business_cta_clicked", {
        source_section: sourceSection,
        cta_label: ctaLabel,
        visitor_type_signal: "business"
      });
    }

    trackLandingEvent("business_cta_clicked", {
      source_section: sourceSection,
      cta_label: ctaLabel,
      visitor_type_signal: "business"
    });
    scrollToId("business-interest");
  }

  return (
    <div className="site-shell" data-future-topic-count={futureTopicCount}>
      <nav className="nav">
        <a className="brand" href="#top" aria-label="Scuba Steve AI home">
          <img src={media.brand.oseaLogo.src} alt="" />
          <span>Scuba Steve AI</span>
        </a>
        <button className="nav-button" onClick={() => launchApp("nav", "Open Scuba Steve Free")}>
          Open Scuba Steve Free
        </button>
      </nav>

      <header id="top" className="hero">
        <div className="hero-media" aria-hidden="true">
          <img src={media.hero.background.src} alt="" fetchPriority="high" decoding="async" />
        </div>
        <div className="hero-content">
          <p className="eyebrow">AI scuba assistant</p>
          <h1>Identify marine life, plan better dives, and fix underwater photos.</h1>
          <p className="subheadline">
            Scuba Steve is an AI scuba app that helps divers turn photos, trip ideas, and scuba questions into practical next steps before, between, and after dives.
          </p>
          <div className="cta-row hero-actions">
            <button className="primary-cta primary-cta-strong" onClick={() => launchApp("hero", "Open Scuba Steve Free")}>
              Open Scuba Steve Free
            </button>
            <button className="secondary-cta" onClick={() => openBusinessInterest("hero", "Dive Shop? Request Info")}>
              Dive Shop? Request Info
            </button>
          </div>
          <p className="safety-copy">
            No credit card. Start with a question, photo, or trip idea. Learning and planning support only; always follow certified training and local dive guidance.
          </p>
        </div>
        <div className="device" aria-label="Scuba Steve trip planner preview">
          <div className="device-top" />
          <img src={media.product.tripPlanner.src} alt="Scuba Steve AI dive trip planner app preview for scuba destination planning" />
        </div>
      </header>

      <section className="problem-section">
        <div className="section-heading">
          <p className="eyebrow dark-eyebrow">Why divers open Steve</p>
          <h2>Four everyday dive moments. One focused scuba AI assistant.</h2>
        </div>
        <div className="problem-grid">
          {problems.map((problem) => (
            <span key={problem}>{problem}</span>
          ))}
        </div>
      </section>

      <section className="solution-section">
        <div className="section-heading">
          <p className="eyebrow dark-eyebrow">What Steve does</p>
          <h2>Get clearer answers before, between, and after dives.</h2>
        </div>
        <div className="solution-grid">
          {solutions.map((solution) => (
            <article key={solution.title} className="solution-card">
              <img src={solution.image.src} alt={solution.image.alt} loading="lazy" decoding="async" />
              <div>
                <h3>{solution.title}</h3>
                <p>{solution.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-section">
        {trustItems.map((item) => (
          <div key={item} className="trust-item">
            <span>✓</span>
            {item}
          </div>
        ))}
      </section>

      <section className="seo-section">
        <div className="section-heading">
          <p className="eyebrow dark-eyebrow">How Divers Use Scuba Steve</p>
          <h2>An AI scuba app for marine life identification, dive planning, and underwater photo enhancement.</h2>
        </div>
        <div className="seo-copy">
          {diverUseContent.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section id="faq" className="faq-section">
        <div className="section-heading">
          <p className="eyebrow dark-eyebrow">Scuba Steve AI FAQ</p>
          <h2>Common questions about the scuba AI assistant.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="about" className="founder-section">
        <img src={media.brand.oseaLogo.src} alt="OSEA Diver logo for Scuba Steve AI founder Jay Van der Colff" />
        <div>
          <p className="eyebrow dark-eyebrow">Founder</p>
          <h2>Built from real scuba instruction experience</h2>
          <p>
            Scuba Steve is created by Jay Van der Colff, founder of OSEA Diver, with a practical goal: make useful dive knowledge easier to access while keeping professional training and local guidance central.
          </p>
          <p className="safety-copy">
            Scuba Steve supports learning and planning. It does not replace certified training, professional briefings, local operators, emergency services, or personal dive judgement.
          </p>
        </div>
      </section>

      <section className="final-cta">
        <h2>Start with your next dive question.</h2>
        <p>Open Scuba Steve and choose marine life ID, dive planning, scuba questions, or underwater photo enhancement.</p>
        <button className="primary-cta primary-cta-strong" onClick={() => launchApp("final", "Open Scuba Steve Free")}>
          Open Scuba Steve Free
        </button>
      </section>

      <footer id="business-interest" className="site-footer">
        <div className="footer-brand">
          <img src={media.brand.oseaLogo.src} alt="OSEA Diver logo for Scuba Steve AI scuba assistant" />
          <div>
            <strong>OSEA Diver</strong>
            <span>Scuba Steve AI helps divers and dive businesses support better questions, clearer planning, and more useful post-dive learning.</span>
          </div>
        </div>
        <form className="footer-form" onFocusCapture={trackBusinessFormStarted} onSubmit={submitBusinessInterest} aria-label="Business interest form">
          <h3>Bring Scuba Steve to your dive business</h3>
          <p>
            For dive centres, resorts, liveaboards, instructors, and travel companies that want an AI scuba assistant for guest questions, dive planning, marine-life learning, and pre-trip education.
          </p>
          <div className="form-grid">
            <label>
              Name
              <input name="name" type="text" required disabled={businessState === "loading"} />
            </label>
            <label>
              Email
              <input name="email" type="email" required disabled={businessState === "loading"} />
            </label>
            <label>
              Business Name
              <input name="businessName" type="text" required disabled={businessState === "loading"} />
            </label>
            <label>
              Business Type
              <select name="businessType" required disabled={businessState === "loading"}>
                <option value="">Select one</option>
                <option>Dive Centre</option>
                <option>Dive Resort</option>
                <option>Liveaboard</option>
                <option>Instructor</option>
                <option>Travel Company</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Country
              <input name="country" type="text" required disabled={businessState === "loading"} />
            </label>
            <label>
              Website
              <input name="website" type="url" placeholder="Optional" disabled={businessState === "loading"} />
            </label>
          </div>
          <label className="honeypot-field" aria-hidden="true">
            Website URL
            <input name="websiteUrl" type="text" tabIndex={-1} autoComplete="off" disabled={businessState === "loading"} />
          </label>
          <label>
            Message
            <textarea name="message" placeholder="Optional" disabled={businessState === "loading"} />
          </label>
          <button type="submit" disabled={businessState === "loading"}>
            {businessState === "loading" ? "Sending..." : "Request Business Follow-Up"}
          </button>
          {businessState === "success" && <p className="success">Thanks. We'll contact you about a Scuba Steve business pilot.</p>}
          {businessState === "error" && <p className="error">{businessError}</p>}
        </form>
      </footer>
    </div>
  );
}
