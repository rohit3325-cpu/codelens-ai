import { connectToDatabase } from "@/lib/mongodb";
import { Subscription } from "@/models/Subscription";
import { Repository } from "@/models/Repository";
import { type PaymentDocument } from "@/models/Payment";
import { FREE_PLAN_REPO_LIMIT, PRO_PERIOD_DAYS, type PlanId } from "@/lib/plans";

export interface ActivePlan {
  plan: PlanId;
  currentPeriodEnd: Date | null;
}

export interface SubscriptionSummary extends ActivePlan {
  reposUsedThisMonth: number;
  repoLimit: number | null;
}

export function startOfCurrentMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function getActivePlan(userId: string): Promise<ActivePlan> {
  await connectToDatabase();

  const subscription = await Subscription.findOne({ userId }).lean();

  if (subscription && subscription.currentPeriodEnd > new Date()) {
    return { plan: "pro", currentPeriodEnd: subscription.currentPeriodEnd };
  }

  return { plan: "free", currentPeriodEnd: null };
}

export async function getSubscriptionSummary(userId: string): Promise<SubscriptionSummary> {
  const activePlan = await getActivePlan(userId);

  const reposUsedThisMonth = await Repository.countDocuments({
    userId,
    analyzedAt: { $gte: startOfCurrentMonth() },
  });

  return {
    ...activePlan,
    reposUsedThisMonth,
    repoLimit: activePlan.plan === "free" ? FREE_PLAN_REPO_LIMIT : null,
  };
}

/**
 * Idempotent: a Razorpay payment can be confirmed via both the client-side
 * verify call and the webhook, so this no-ops once a payment is already paid.
 */
export async function markPaymentPaidAndExtendSubscription(
  payment: PaymentDocument,
  razorpayPaymentId: string,
  razorpaySignature?: string
): Promise<void> {
  if (payment.status === "paid") {
    return;
  }

  payment.status = "paid";
  payment.razorpayPaymentId = razorpayPaymentId;
  if (razorpaySignature) {
    payment.razorpaySignature = razorpaySignature;
  }
  await payment.save();

  const now = new Date();
  const existing = await Subscription.findOne({ userId: payment.userId });
  const base = existing && existing.currentPeriodEnd > now ? existing.currentPeriodEnd : now;
  const currentPeriodEnd = new Date(base.getTime() + PRO_PERIOD_DAYS * 24 * 60 * 60 * 1000);

  await Subscription.findOneAndUpdate(
    { userId: payment.userId },
    { plan: "pro", currentPeriodEnd },
    { upsert: true }
  );
}
