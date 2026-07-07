/**
 * Homepage FAQ (strategy §S9). These items MUST stay in lockstep with the
 * FAQPage JSON-LD in index.html — edit both together or the structured data
 * misrepresents the page. Kept verbatim from the existing schema.
 */

export const FAQ_ITEMS = [
  {
    q: "What is Scuba Steve AI?",
    a: "Scuba Steve AI is an AI scuba app for marine life identification, dive trip planning, scuba learning, and underwater photo enhancement."
  },
  {
    q: "Can Scuba Steve identify marine life from a dive photo?",
    a: "Scuba Steve can help divers use a photo as a starting point for marine life identification, with practical context and careful learning support."
  },
  {
    q: "Does Scuba Steve work as a dive trip planner?",
    a: "Scuba Steve helps divers think through destination ideas, operator questions, conditions, logistics, and planning steps before a dive trip."
  },
  {
    q: "Is Scuba Steve a scuba AI assistant for beginners?",
    a: "Beginners can use Scuba Steve for plain-language scuba questions and learning support, but it does not replace certified scuba training or professional instruction."
  },
  {
    q: "Can Scuba Steve help with underwater photo enhancement?",
    a: "Scuba Steve includes underwater photo tools that help divers improve and review underwater images."
  },
  {
    q: "Does Scuba Steve replace dive training or emergency services?",
    a: "No. Scuba Steve supports learning and planning only. It does not replace certified training, dive professionals, local briefings, emergency services, or personal dive judgement."
  }
];

export function Faq() {
  return (
    <div className="faq-list">
      {FAQ_ITEMS.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
