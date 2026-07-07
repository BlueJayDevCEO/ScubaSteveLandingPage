import { useState } from "react";
import { trackLandingEvent } from "../analytics";

type DemoTab = {
  id: string;
  label: string;
  prompt: string;
  attachment?: string;
  answer: string[];
};

const DEMO_TABS: DemoTab[] = [
  {
    id: "trip-planner",
    label: "Trip Planner",
    prompt: "Plan me a 7-day dive trip to Mozambique for two divers and one non-diver.",
    answer: [
      "Great brief. Tofo or Ponta do Ouro both work well for that mix.",
      "Rough shape: Days 1–2 arrive and check dives, Days 3–5 two-tank mornings (Manta Reef, Giants Castle), Day 6 ocean safari your non-diver can join, Day 7 as your no-fly buffer.",
      "Want me to draft operator questions and a packing list next?"
    ]
  },
  {
    id: "marine-id",
    label: "Marine ID",
    prompt: "What species is this, and where is it normally found?",
    attachment: "reef-photo.jpg",
    answer: [
      "That looks like a honeycomb moray (Gymnothorax favagineus) — the dark honeycomb pattern is distinctive.",
      "They're common on Indo-Pacific reefs, usually watching from crevices with the mouth slowly opening and closing — that's breathing, not aggression.",
      "Treat this as a starting point and confirm with your local guide."
    ]
  },
  {
    id: "dive-sites",
    label: "Dive Sites",
    prompt: "What should I know before diving Aliwal Shoal?",
    answer: [
      "Aliwal Shoal is a rocky reef about 5 km offshore — expect boat entries, surge, and sites from roughly 12 to 30 m.",
      "Highlights include ragged-tooth sharks in the cooler months, Cathedral, and the Produce wreck. Currents can pick up quickly.",
      "Book with a local operator and follow their briefing — want a conditions checklist for the week you're going?"
    ]
  },
  {
    id: "refresh",
    label: "Refresh",
    prompt: "I haven't dived in eight months. What should I refresh before my next trip?",
    answer: [
      "Eight months out of the water is worth a proper refresh.",
      "Core areas: buoyancy and weighting, mask and regulator skills, gas planning basics, hand signals, and your own gear setup.",
      "A pool refresher with an instructor is the gold standard — I can build a study plan for the knowledge side."
    ]
  }
];

export function DemoShowcase() {
  const [activeId, setActiveId] = useState(DEMO_TABS[0].id);
  const active = DEMO_TABS.find((tab) => tab.id === activeId) ?? DEMO_TABS[0];

  function selectTab(tab: DemoTab) {
    if (tab.id === activeId) return;
    setActiveId(tab.id);
    trackLandingEvent("feature_demo_interacted", {
      source_section: "demo",
      demo_tab: tab.id
    });
  }

  return (
    <div className="demo-shell">
      <div className="demo-tabs" role="tablist" aria-label="Scuba Steve example conversations">
        {DEMO_TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`demo-tab-${tab.id}`}
            aria-selected={tab.id === activeId}
            aria-controls={`demo-panel-${tab.id}`}
            className={`demo-tab ${tab.id === activeId ? "is-active" : ""}`}
            onClick={() => selectTab(tab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="demo-window"
        role="tabpanel"
        id={`demo-panel-${active.id}`}
        aria-labelledby={`demo-tab-${active.id}`}
      >
        <div className="demo-window-top" aria-hidden="true">
          <span />
          <span />
          <span />
          <em>Scuba Steve</em>
        </div>
        <div className="demo-conversation" key={active.id}>
          <div className="demo-bubble demo-user">
            {active.attachment && <span className="demo-attachment">📷 {active.attachment}</span>}
            <p>{active.prompt}</p>
          </div>
          <div className="demo-bubble demo-steve">
            <span className="demo-steve-name">Steve</span>
            {active.answer.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>
      <p className="demo-note">
        Illustrative example — real answers adapt to your questions and stay safety-aware.
      </p>
    </div>
  );
}
