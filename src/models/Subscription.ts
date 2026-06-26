import { Schema, model, models, type Document, type Model } from "mongoose";

export interface SubscriptionDocument extends Document {
  userId: string;
  plan: "pro";
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<SubscriptionDocument>(
  {
    userId: { type: String, required: true, unique: true },
    plan: { type: String, enum: ["pro"], required: true },
    currentPeriodEnd: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Subscription: Model<SubscriptionDocument> =
  models.Subscription ||
  model<SubscriptionDocument>("Subscription", SubscriptionSchema);
