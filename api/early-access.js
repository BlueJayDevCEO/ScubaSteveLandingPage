import crypto from "node:crypto";
import { firestoreRequest, getFirebaseCredentials, hasFirebaseCredentials, toFirestoreFields } from "./_lib/firebase-rest.js";
import { methodNotAllowed, readJsonBody, setCors } from "./_lib/http.js";
import { sendEnquiryNotification } from "./_lib/notify.js";
import { EMAIL_PATTERN, sanitizeText } from "./_lib/validation.js";

// Legacy-unused endpoint: the current landing page no longer renders an early-access form.
// Retained only for old deployments/links that may still POST to /api/early-access.
const COLLECTION_NAME = "earlyAccessLeads";

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return methodNotAllowed(res);
  }

  const body = readJsonBody(req);
  const email = sanitizeText(body.email, 254).toLowerCase();
  const name = sanitizeText(body.name);
  const diverLevel = sanitizeText(body.diverLevel);

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const credentials = getFirebaseCredentials();
  if (!hasFirebaseCredentials(credentials)) {
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

    try {
      await sendEnquiryNotification({ visitorType: "diver", name, email, message: diverLevel, source: "landing-page (early-access)" });
    } catch (notifyError) {
      console.error("enquiry_notification_failed", notifyError);
    }

    return res.status(200).json({ ok: true, duplicate: false });
  } catch (error) {
    console.error("early_access_failed", error);
    return res.status(500).json({ error: "We could not add you right now. Please try again in a moment." });
  }
}
