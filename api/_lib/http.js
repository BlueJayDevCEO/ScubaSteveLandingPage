const DEFAULT_ORIGIN = "https://scuba-steve-landing-page.vercel.app";

const ALLOWED_ORIGINS = new Set([
  "https://scuba-steve-landing-page.vercel.app",
  "https://www.scubasteve.rocks",
  "https://scubasteve.rocks",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:4173"
]);

export function setCors(req, res, fallbackOrigin = DEFAULT_ORIGIN) {
  const origin = String(req.headers.origin || "");
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : fallbackOrigin;
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Origin");
}

export function readJsonBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body;
  try {
    return JSON.parse(req.body.toString());
  } catch {
    return {};
  }
}

export function isBodyTooLarge(req, maxBytes) {
  const contentLength = Number(req.headers["content-length"] || 0);
  if (Number.isFinite(contentLength) && contentLength > maxBytes) return true;

  if (typeof req.body === "string") return Buffer.byteLength(req.body, "utf8") > maxBytes;
  if (Buffer.isBuffer(req.body)) return req.body.length > maxBytes;
  if (req.body && typeof req.body === "object") {
    return Buffer.byteLength(JSON.stringify(req.body), "utf8") > maxBytes;
  }

  return false;
}

export function methodNotAllowed(res) {
  return res.status(405).json({ error: "Method not allowed" });
}

