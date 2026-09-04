import { CREATE_PAYMENT_URL, ORDER_STATUS_URL } from "./config.js";

/**
 * Starts a real MTN/Airtel Mobile Money collection for this order via the
 * create-payment Edge Function (which holds the MarzPay credentials — the
 * browser never sees them). This triggers a payment prompt on the buyer's
 * phone. Resolves once MarzPay has accepted the request and the prompt has
 * been sent — NOT once it's been paid; call pollOrderStatus() after this to
 * find out when (or whether) it actually completes.
 */
export async function startMarzPayCollection(orderRef) {
  const res = await fetch(CREATE_PAYMENT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_ref: orderRef }),
  });
  const result = await res.json();
  if (!result.ok) throw new Error(result.error || "Could not start payment.");
  return result;
}

/**
 * Polls the order-status Edge Function until the order is paid or failed
 * (MarzPay's webhook updates the real status server-side — this just checks
 * in on it), or until timeoutMs elapses.
 * Returns "paid" | "failed" | "timeout".
 */
export async function pollOrderStatus(orderRef, { intervalMs = 3000, timeoutMs = 120000 } = {}) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(`${ORDER_STATUS_URL}?order_ref=${encodeURIComponent(orderRef)}`);
      const result = await res.json();
      if (result.ok && (result.status === "paid" || result.status === "failed")) {
        return result.status;
      }
    } catch (e) {
      // transient network hiccup — just try again on the next tick
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return "timeout";
}
