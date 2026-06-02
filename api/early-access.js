import crypto from "node:crypto";

const ALLOWED_ORIGINS = new Set([
  "https://www.scubasteve.rocks",
  "https://scubasteve.rocks",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:4173"
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FIRESTORE_SCOPE = "https://www.googleapis.com/auth/datastore";
const COLLECTION_NAME = "earlyAccessLeads";

let cachedAccessToken = null;
let cachedAccessTokenExpiry = 0;

function setCors(req, res) {
  const origin = String(req.headers.origin || "");
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://www.scubasteve.rocks";
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Vary", "Origin");
}

function readJsonBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

function sanitizeText(value, maxLength = 120) {
  return String(value || "").trim().slice(0, maxLength);
}

function getFirebaseCredentials() {
  if (process.env.ADMIN_CREDENTIALS_JSON) {
    try {
      const parsed = JSON.parse(process.env.ADMIN_CREDENTIALS_JSON);
      return {
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key
      };
    } catch {
      return null;
    }
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
  };
}

function base64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createJwt(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: credentials.clientEmail,
    scope: FIRESTORE_SCOPE,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now
  };
  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claim))}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  return `${unsigned}.${signer.sign(credentials.privateKey, "base64url")}`;
}

async function getAccessToken(credentials) {
  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiry - 60_000) {
    return cachedAccessToken;
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: createJwt(credentials)
    })
  });

  if (!response.ok) {
    throw new Error("token_exchange_failed");
  }

  const payload = await response.json();
  cachedAccessToken = payload.access_token;
  cachedAccessTokenExpiry = Date.now() + Number(payload.expires_in || 3600) * 1000;
  return cachedAccessToken;
}

function toFirestoreFields(lead) {
  const fields = {};
  for (const [key, value] of Object.entries(lead)) {
    fields[key] = value instanceof Date ? { timestampValue: value.toISOString() } : { stringValue: String(value || "") };
  }
  return { fields };
}

async function firestoreRequest(credentials, path, options = {}) {
  const accessToken = await getAccessToken(credentials);
  return fetch(`https://firestore.googleapis.com/v1/projects/${credentials.projectId}/databases/(default)/documents/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = readJsonBody(req);
  const email = sanitizeText(body.email, 254).toLowerCase();
  const name = sanitizeText(body.name);
  const diverLevel = sanitizeText(body.diverLevel);

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const credentials = getFirebaseCredentials();
  if (!credentials?.projectId || !credentials?.clientEmail || !credentials?.privateKey) {
    return res.status(503).json({ error: "Early access signup is not configured yet." });
  }

  const documentId = crypto.createHash("sha256").update(email).digest("hex");
  const documentPath = `${COLLECTION_NAME}/${documentId}`;

  try {
    const existing = await firestoreRequest(credentials, documentPath);
    if (existing.ok) {
      return res.status(200).json({ ok: true, duplicate: true });
    }

    const payload = toFirestoreFields({
      email,
      name,
      diverLevel,
      source: "landing-page",
      createdAt: new Date(),
      userAgent: sanitizeText(req.headers["user-agent"], 500),
      referrer: sanitizeText(req.headers.referer || req.headers.referrer, 500)
    });

    const response = await firestoreRequest(credentials, documentPath, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("firestore_write_failed");
    }

    return res.status(200).json({ ok: true, duplicate: false });
  } catch {
    return res.status(500).json({ error: "We could not add you right now. Please try again in a moment." });
  }
}
