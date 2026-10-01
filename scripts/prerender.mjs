import { build } from "vite";
import { readFile, mkdir, writeFile } from "node:fs/promises";
await build({ build: { ssr: "src/pilot-prerender.tsx", outDir: ".pilot-build" } });
const { render, pilotMeta } = await import("../.pilot-build/pilot-prerender.js");
let html = await readFile("dist/index.html", "utf8");
const escape = (s) => s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
html = html.replace(/<title>.*?<\/title>/s, `<title>${escape(pilotMeta.title)}</title>`);
for (const [attribute, key, value] of [
  ["name", "description", pilotMeta.description], ["property", "og:title", pilotMeta.title],
  ["property", "og:description", pilotMeta.description], ["property", "og:url", pilotMeta.url],
  ["name", "twitter:title", pilotMeta.title], ["name", "twitter:description", pilotMeta.description]
]) html = html.replace(new RegExp(`<meta ${attribute}="${key}" content="[^"]*"\\s*/>`), `<meta ${attribute}="${key}" content="${escape(value)}" />`);
html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${pilotMeta.url}" />`);
const schema = { "@context": "https://schema.org", "@type": "WebPage", "@id": `${pilotMeta.url}#webpage`, url: pilotMeta.url, name: pilotMeta.title, description: pilotMeta.description };
html = html.replace(/<script type="application\/ld\+json">.*?<\/script>/s, `<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`);
await mkdir("dist/dive-centres", { recursive: true });
await writeFile("dist/dive-centres/index.html", html);

// Vercel sends a permanent redirect first. This is a crawlable fallback for static hosts.
const rootHtml = html.replace('</head>', '<meta http-equiv="refresh" content="0; url=/dive-centres" /></head>');
await writeFile("dist/index.html", rootHtml);
