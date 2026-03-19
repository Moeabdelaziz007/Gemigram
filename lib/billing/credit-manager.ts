import { db, auth } from "../../firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

/**
 * Neural Budget Orchestrator.
 * Manages usage-based credits for Sovereign Processing.
 */
export class CreditManager {
  private static BASE_COST = 1; // Credit per standard tool call
  private static TOKEN_COST_RATIO = 0.001; // Credits per 1000 tokens

  /**
   * Tracks and deducts credits for an operation.
   */
  static async applyUsageCharge(tokens: number, toolWeight = 1): Promise<void> {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, `users/${user.uid}`);
    const charge = Math.ceil((tokens * this.TOKEN_COST_RATIO) + (toolWeight * this.BASE_COST));

    try {
      await updateDoc(userRef, {
        credits: increment(-charge),
        lastChargeAt: new Date().toISOString(),
        totalCharges: increment(charge)
      });
      console.log(`[CreditManager] Applied charge: ${charge} units.`);
    } catch (error) {
      console.error("[CreditManager] Failed to apply charge substrate:", error);
    }
  }

  /**
   * Checks if user has sufficient credits.
   */
  static async hasSufficientCredits(threshold = 5): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    const userRef = doc(db, `users/${user.uid}`);
    const snap = await getDoc(userRef);
    const credits = snap.data()?.credits || 0;

    return credits >= threshold;
  }
}
