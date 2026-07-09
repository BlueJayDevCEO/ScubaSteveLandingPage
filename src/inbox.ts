// Reliable, device-independent delivery for enquiries and forms.
// Posts to our OWN first-party serverless endpoint (/api/business-interest),
// which emails steve@scubasteve.rocks via Resend and (optionally) stores the
// lead in Firestore. No third-party form relay; visitor data only touches our
// function, Resend and Firebase.
//
// Delivery requires the backend to be configured in Vercel — see README
// (RESEND_API_KEY to send email; Firebase admin creds to also store leads).

export const ENQUIRY_EMAIL = "steve@scubasteve.rocks";

/** Submits an enquiry to our API. Resolves true when accepted. */
export async function sendToInbox(payload: Record<string, string>): Promise<boolean> {
  try {
    const response = await fetch("/api/business-interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return response.ok;
  } catch {
    return false;
  }
}
