import crypto from "node:crypto";
import { firestoreRequest, getFirebaseCredentials, hasFirebaseCredentials, toFirestoreFields } from "./_lib/firebase-rest.js";
import { isBodyTooLarge, methodNotAllowed, readJsonBody, setCors } from "./_lib/http.js";
import { EMAIL_PATTERN, isValidOptionalUrl, sanitizeText } from "./_lib/validation.js";

const COLLECTION_NAME = "businessInterestLeads";
const MAX_BODY_BYTES = 8 * 1024;

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return methodNotAllowed(res);
  }

  if (isBodyTooLarge(req, MAX_BODY_BYTES)) {
    return res.status(413).json({ error: "Request body is too large." });
  }

  const body = readJsonBody(req);
  if (body.websiteUrl || body.company || body.url) {
    return res.status(200).json({ ok: true, spam: true });
  }

  const visitorType = body.visitorType === "business" ? "business" : "diver";
  const email = sanitizeText(body.email, 254).toLowerCase();
  const lead = {
    visitorType,
    name: sanitizeText(body.name),
    email,
    businessName: sanitizeText(body.businessName),
    businessType: sanitizeText(body.businessType),
    country: sanitizeText(body.country),
    website: sanitizeText(body.website, 300),
    message: sanitizeText(body.message, 1000)
  };

  if (
    !lead.name ||
    !EMAIL_PATTERN.test(email) ||
    !lead.country ||
    (visitorType === "business" && (!lead.businessName || !lead.businessType)) ||
    !isValidOptionalUrl(lead.website)
  ) {
    return res.status(400).json({ error: "Please complete the required signup fields." });
  }

  const credentials = getFirebaseCredentials();
  if (!hasFirebaseCredentials(credentials)) {
    return res.status(503).json({ error: "Business interest signup is not configured yet." });
  }

  const documentId = crypto.createHash("sha256").update(email).digest("hex");
  const documentPath = `${COLLECTION_NAME}/${documentId}`;

  try {
    const existing = await firestoreRequest(credentials, documentPath);
    if (existing.ok) {
      return res.status(200).json({ ok: true, duplicate: true });
    }

    const payload = toFirestoreFields({
      ...lead,
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
  } catch (error) {
    console.error("business_interest_failed", error);
    return res.status(500).json({ error: "We could not register your interest right now. Please try again in a moment." });
  }
}
