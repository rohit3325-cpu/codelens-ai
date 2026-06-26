import { Schema, model, models, type Document, type Model } from "mongoose";

export type PaymentStatus = "created" | "paid" | "failed";

export interface PaymentDocument extends Document {
  userId: string;
  plan: "pro";
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<PaymentDocument>(
  {
    userId: { type: String, required: true },
    plan: { type: String, enum: ["pro"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
  },
  { timestamps: true }
);

PaymentSchema.index({ userId: 1, createdAt: -1 });

export const Payment: Model<PaymentDocument> =
  models.Payment || model<PaymentDocument>("Payment", PaymentSchema);
