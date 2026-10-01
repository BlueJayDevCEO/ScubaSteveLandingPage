export const pilotMeta = {
  title: "Dive Centre Pilot: Scuba Steve AI for Dive Shops",
  description: "Apply for the Scuba Steve Dive Centre Pilot. Selected shops provide courses, pricing, schedules and local knowledge for review before customer testing.",
  url: "https://www.scubasteve.rocks/dive-centres"
};

export function updateRouteMetadata(isPilot: boolean, title: string, description: string) {
  const url = isPilot ? pilotMeta.url : "https://www.scubasteve.rocks/";
  document.title = title;
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
  for (const [selector, value] of [
    ['meta[name="description"]', description],
    ['meta[property="og:title"]', title], ['meta[property="og:description"]', description],
    ['meta[property="og:url"]', url], ['meta[name="twitter:title"]', title],
    ['meta[name="twitter:description"]', description]
  ]) document.querySelector(selector)?.setAttribute("content", value);
  const schema = document.querySelector('script[type="application/ld+json"]');
  if (schema) {
    const original = schema.getAttribute("data-home-schema") || schema.textContent || "{}";
    schema.setAttribute("data-home-schema", original);
    schema.textContent = isPilot ? JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url }) : original;
  }
}
