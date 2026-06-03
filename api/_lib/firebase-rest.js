import crypto from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FIRESTORE_SCOPE = "https://www.googleapis.com/auth/datastore";

let cachedAccessToken = null;
let cachedAccessTokenExpiry = 0;

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

export function getFirebaseCredentials() {
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

export function hasFirebaseCredentials(credentials) {
  return Boolean(credentials?.projectId && credentials?.clientEmail && credentials?.privateKey);
}

export function toFirestoreFields(lead) {
  const fields = {};
  for (const [key, value] of Object.entries(lead)) {
    fields[key] = value instanceof Date ? { timestampValue: value.toISOString() } : { stringValue: String(value || "") };
  }
  return { fields };
}

export async function firestoreRequest(credentials, path, options = {}) {
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

