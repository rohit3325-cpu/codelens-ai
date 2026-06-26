export const FREE_PLAN_REPO_LIMIT = 5;
export const PRO_PERIOD_DAYS = 30;

export const PLAN_PRICING = {
  pro: { amount: 99900, currency: "INR" as const, label: "Pro" },
};

export type PaidPlanId = keyof typeof PLAN_PRICING;
export type PlanId = "free" | PaidPlanId;

export function isPaidPlanId(value: unknown): value is PaidPlanId {
  return typeof value === "string" && value in PLAN_PRICING;
}
