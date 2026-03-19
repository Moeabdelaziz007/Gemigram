import { loadStripe } from "@stripe/stripe-js";

/**
 * Commercial Backbone for GemigramOS.
 */
export class StripeService {
  private static STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  /**
   * Redirects user to Stripe Checkout.
   */
  static async startCheckout(priceId: string): Promise<void> {
    const stripe = await loadStripe(this.STRIPE_KEY);
    if (!stripe) throw new Error("Stripe Failed to Load.");

    // In a real implementation, this would call a server-side route
    // /api/stripe/checkout to create a session.
    console.log(`[Stripe] Initiating Checkout for Price: ${priceId}`);
    
    const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId })
    });

    const { sessionId } = await response.json();
    await stripe.redirectToCheckout({ sessionId });
  }

  /**
   * Navigates to Stripe Billing Portal.
   */
  static async openPortal(): Promise<void> {
    const response = await fetch("/api/stripe/portal", { method: "POST" });
    const { url } = await response.json();
    window.location.href = url;
  }
}
