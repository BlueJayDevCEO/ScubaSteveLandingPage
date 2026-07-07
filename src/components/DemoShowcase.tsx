import { useEffect, useRef, useState } from "react";
import { trackLandingEvent } from "../analytics";
import { media } from "../media";

/**
 * Demo suite (strategy §11). Interactive tabs; each panel renders a scripted
 * answer plus one structured, product-shaped artifact (itinerary, ID card,
 * site brief, refresh checklist). Content is illustrative and labelled.
 *
 * // TODO(phase-c): replace answer/artifact copy with founder-approved
 * transcripts generated from the real app before production.
 *
 * Controlled tab: HomePage passes activeId/onSelect so the "moments" cards can
 * deep-link to a specific demo. Falls back to internal state if omitted.
 */

type Artifact =
  | { kind: "itinerary"; head: string; rows: { day: string; text: string }[]; chips?: string[] }
  | { kind: "id"; head: string; photo: string; name: string; latin: string; confidence: string; notes: string[] }
  | { kind: "brief"; head: string; facts: { label: string; value: string }[] }
  | { kind: "checklist"; head: string; items: string[] };

type DemoTab = {
  id: string;
  label: string;
  prompt: string;
  attachment?: string;
  answer: string[];
  artifact: Artifact;
};

const DEMO_TABS: DemoTab[] = [
  {
    id: "trip-planner",
    label: "Trip Planner",
    prompt: "Plan me a 7-day dive trip to Mozambique for two divers and one non-diver.",
    answer: [
      "Great brief. Tofo or Ponta do Ouro both work well for that mix.",
      "Here's a rough shape to react to — want me to draft operator questions and a packing list next?"
    ],
    artifact: {
      kind: "itinerary",
      head: "Draft itinerary · 7 days · Tofo",
      rows: [
        { day: "Day 1–2", text: "Arrive, settle in, easy check dives" },
        { day: "Day 3–5", text: "Two-tank mornings — Manta Reef, Giant's Castle" },
        { day: "Day 6", text: "Ocean safari your non-diver can join" },
        { day: "Day 7", text: "No-fly buffer before flying home" }
      ],
      chips: ["Operator questions", "Packing list", "Best season"]
    }
  },
  {
    id: "marine-id",
    label: "Marine ID",
    prompt: "What species is this, and where is it normally found?",
    attachment: "reef-photo.jpg",
    answer: [
      "That looks like a honeycomb moray — the dark honeycomb pattern is distinctive.",
      "The mouth slowly opening and closing is breathing, not aggression. Treat this as a starting point and confirm with your local guide."
    ],
    artifact: {
      kind: "id",
      head: "Identification",
      photo: media.product.marineId.src,
      name: "Honeycomb moray",
      latin: "Gymnothorax favagineus",
      confidence: "Likely match",
      notes: ["Indo-Pacific reefs", "Watches from crevices", "Confirm with your guide"]
    }
  },
  {
    id: "dive-sites",
    label: "Dive Sites",
    prompt: "What should I know before diving Aliwal Shoal?",
    answer: [
      "Aliwal Shoal is a rocky reef about 5 km offshore — expect boat entries and some surge.",
      "Currents can pick up quickly, so book with a local operator and follow their briefing. Want a conditions checklist for your dates?"
    ],
    artifact: {
      kind: "brief",
      head: "Site brief · Aliwal Shoal",
      facts: [
        { label: "Depth", value: "12–30 m" },
        { label: "Entry", value: "Boat" },
        { label: "Conditions", value: "Surge, variable current" },
        { label: "Known for", value: "Raggies (cooler months)" }
      ]
    }
  },
  {
    id: "refresh",
    label: "Refresh",
    prompt: "I haven't dived in eight months. What should I refresh before my next trip?",
    answer: [
      "Eight months out of the water is worth a proper refresh.",
      "A pool refresher with an instructor is the gold standard — I can build a study plan for the knowledge side."
    ],
    artifact: {
      kind: "checklist",
      head: "Refresh checklist",
      items: [
        "Buoyancy and weighting",
        "Mask and regulator skills",
        "Gas planning basics",
        "Hand signals",
        "Your own gear setup"
      ]
    }
  }
];

export const DEMO_TAB_IDS = DEMO_TABS.map((t) => t.id);

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function ArtifactView({ artifact }: { artifact: Artifact }) {
  if (artifact.kind === "itinerary") {
    return (
      <div className="artifact">
        <div className="artifact-head">{artifact.head}</div>
        <div className="artifact-body">
          {artifact.rows.map((r) => (
            <div className="itin-row" key={r.day}>
              <b>{r.day}</b>
              <span>{r.text}</span>
            </div>
          ))}
        </div>
        {artifact.chips && (
          <div className="artifact-chips">
            {artifact.chips.map((c) => (
              <span className="artifact-chip" key={c}>
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
  if (artifact.kind === "id") {
    return (
      <div className="artifact">
        <div className="artifact-head">{artifact.head}</div>
        <div className="artifact-body">
          <div className="id-card">
            <img className="id-thumb" src={artifact.photo} alt="" loading="lazy" decoding="async" />
            <div className="id-meta">
              <span className="confidence-tag">{artifact.confidence}</span>
              <strong>{artifact.name}</strong>
              <span className="latin">{artifact.latin}</span>
            </div>
          </div>
          <ul className="check-list">
            {artifact.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  if (artifact.kind === "brief") {
    return (
      <div className="artifact">
        <div className="artifact-head">{artifact.head}</div>
        <div className="artifact-body">
          <div className="brief-grid">
            {artifact.facts.map((f) => (
              <div key={f.label}>
                <span>{f.label}</span>
                {f.value}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="artifact">
      <div className="artifact-head">{artifact.head}</div>
      <div className="artifact-body">
        <ul className="check-list">
          {artifact.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type DemoShowcaseProps = {
  activeId?: string;
  onSelect?: (id: string) => void;
};

export function DemoShowcase({ activeId: controlledId, onSelect }: DemoShowcaseProps) {
  const [internalId, setInternalId] = useState(DEMO_TABS[0].id);
  const activeId = controlledId ?? internalId;
  const active = DEMO_TABS.find((tab) => tab.id === activeId) ?? DEMO_TABS[0];

  const [visibleParas, setVisibleParas] = useState(active.answer.length);
  const [showArtifact, setShowArtifact] = useState(true);
  const [runKey, setRunKey] = useState(0);
  const startedRef = useRef(false);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Run the streaming animation for the active tab.
  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisibleParas(active.answer.length);
      setShowArtifact(true);
      return;
    }
    setVisibleParas(0);
    setShowArtifact(false);
    const timers: number[] = [];
    active.answer.forEach((_, i) => {
      timers.push(window.setTimeout(() => setVisibleParas(i + 1), 420 + i * 540));
    });
    const total = 420 + active.answer.length * 540;
    timers.push(
      window.setTimeout(() => {
        setShowArtifact(true);
        trackLandingEvent("product_demo_completed", { demo_id: active.id, source_section: "demo" });
      }, total)
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [active.id, runKey]);

  // Auto-run the visible tab once when the section first enters the viewport.
  useEffect(() => {
    if (startedRef.current || prefersReducedMotion()) return;
    const el = shellRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          startedRef.current = true;
          setRunKey((k) => k + 1);
          trackLandingEvent("product_demo_started", { demo_id: active.id, source_section: "demo" });
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectTab(tab: DemoTab, fromKeyboard = false) {
    if (tab.id !== activeId) {
      if (onSelect) onSelect(tab.id);
      else setInternalId(tab.id);
      trackLandingEvent("feature_demo_interacted", { source_section: "demo", demo_tab: tab.id });
      trackLandingEvent("feature_selected", { source_section: "demo", feature: tab.id });
      trackLandingEvent("product_demo_started", { demo_id: tab.id, source_section: "demo" });
    }
    if (fromKeyboard) {
      const idx = DEMO_TABS.findIndex((t) => t.id === tab.id);
      tabRefs.current[idx]?.focus();
    }
  }

  function onTabKeyDown(e: React.KeyboardEvent) {
    const idx = DEMO_TABS.findIndex((t) => t.id === activeId);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = e.key === "ArrowRight" ? (idx + 1) % DEMO_TABS.length : (idx - 1 + DEMO_TABS.length) % DEMO_TABS.length;
      selectTab(DEMO_TABS[next], true);
    }
  }

  function replay() {
    if (onSelect) {
      // controlled: just bump the run key
    }
    setRunKey((k) => k + 1);
    trackLandingEvent("product_demo_started", { demo_id: active.id, source_section: "demo_replay" });
  }

  const streaming = !prefersReducedMotion() && visibleParas < active.answer.length;

  return (
    <div className="demo-shell" ref={shellRef}>
      <div className="demo-tabs" role="tablist" aria-label="Scuba Steve example conversations" onKeyDown={onTabKeyDown}>
        {DEMO_TABS.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[i] = el)}
            role="tab"
            id={`demo-tab-${tab.id}`}
            aria-selected={tab.id === activeId}
            aria-controls={`demo-panel-${tab.id}`}
            tabIndex={tab.id === activeId ? 0 : -1}
            className={`demo-tab ${tab.id === activeId ? "is-active" : ""}`}
            onClick={() => selectTab(tab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="demo-window" role="tabpanel" id={`demo-panel-${active.id}`} aria-labelledby={`demo-tab-${active.id}`}>
        <div className="demo-window-top" aria-hidden="true">
          <span />
          <span />
          <span />
          <em>Scuba Steve · dive buddy</em>
        </div>
        <div className="demo-conversation" key={`${active.id}-${runKey}`}>
          <div className="demo-bubble demo-user">
            {active.attachment && <span className="demo-attachment">📷 {active.attachment}</span>}
            <p>{active.prompt}</p>
          </div>
          <div className="demo-bubble demo-steve" aria-live="polite">
            <span className="demo-steve-name">Steve</span>
            {(prefersReducedMotion() ? active.answer : active.answer.slice(0, visibleParas)).map((line) => (
              <p key={line}>{line}</p>
            ))}
            {streaming && visibleParas === 0 && (
              <span className="thinking" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            )}
            {showArtifact && <ArtifactView artifact={active.artifact} />}
          </div>
        </div>
      </div>

      <div className="demo-actions">
        <button type="button" className="demo-replay" onClick={replay}>
          ↻ Replay
        </button>
      </div>
      <p className="demo-note">
        Illustrative example — based on real Scuba Steve answers. Real answers adapt to you and stay safety-aware.
      </p>
    </div>
  );
}
