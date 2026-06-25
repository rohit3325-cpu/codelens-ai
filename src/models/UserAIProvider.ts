import { Schema, model, models, type Document, type Model } from "mongoose";
import type { AIProviderName } from "@/lib/aiProviders";

export interface UserAIProviderDocument extends Document {
  userId: string;
  provider: AIProviderName;
  encryptedApiKey: string;
  isActive: boolean;
  lastValidatedAt?: Date;
  lastValidationError?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserAIProviderSchema = new Schema<UserAIProviderDocument>(
  {
    userId: { type: String, required: true },
    provider: {
      type: String,
      enum: ["openai", "gemini", "claude", "openrouter"],
      required: true,
    },
    encryptedApiKey: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    lastValidatedAt: { type: Date },
    lastValidationError: { type: String },
  },
  { timestamps: true }
);

// One key per provider per user — "update" is just an upsert on this index.
UserAIProviderSchema.index({ userId: 1, provider: 1 }, { unique: true });

export const UserAIProvider: Model<UserAIProviderDocument> =
  models.UserAIProvider ||
  model<UserAIProviderDocument>("UserAIProvider", UserAIProviderSchema);
