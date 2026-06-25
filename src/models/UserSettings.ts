import { Schema, model, models, type Document, type Model } from "mongoose";
import type { AIProviderName } from "@/lib/aiProviders";

export type Theme = "light" | "dark" | "system";
export type DashboardTab = "overview" | "files" | "chat" | "architecture" | "onboarding";
export type SummaryLength = "short" | "medium" | "detailed";
export type ArchitectureDetail = "simple" | "advanced";
export type ChatStyle = "concise" | "detailed";

export interface AIPreferences {
  summaryLength: SummaryLength;
  architectureDetail: ArchitectureDetail;
  chatStyle: ChatStyle;
  preferredProvider: AIProviderName;
  preferredModel: string;
}

export interface AutoGeneratePreferences {
  overview: boolean;
  architectureDiagram: boolean;
  fileSummaries: boolean;
  onboardingGuide: boolean;
}

export interface UserSettingsDocument extends Document {
  userId: string;
  theme: Theme;
  defaultDashboardTab: DashboardTab;
  ai: AIPreferences;
  autoGenerate: AutoGeneratePreferences;
  createdAt: Date;
  updatedAt: Date;
}

const AIPreferencesSchema = new Schema<AIPreferences>(
  {
    summaryLength: { type: String, enum: ["short", "medium", "detailed"], default: "medium" },
    architectureDetail: { type: String, enum: ["simple", "advanced"], default: "simple" },
    chatStyle: { type: String, enum: ["concise", "detailed"], default: "concise" },
    preferredProvider: {
      type: String,
      enum: ["openai", "gemini", "claude", "openrouter"],
      default: "openrouter",
    },
    preferredModel: { type: String, default: "openrouter/free" },
  },
  { _id: false }
);

const AutoGeneratePreferencesSchema = new Schema<AutoGeneratePreferences>(
  {
    overview: { type: Boolean, default: true },
    architectureDiagram: { type: Boolean, default: true },
    fileSummaries: { type: Boolean, default: false },
    onboardingGuide: { type: Boolean, default: true },
  },
  { _id: false }
);

const UserSettingsSchema = new Schema<UserSettingsDocument>(
  {
    userId: { type: String, required: true, unique: true },
    theme: { type: String, enum: ["light", "dark", "system"], default: "dark" },
    defaultDashboardTab: {
      type: String,
      enum: ["overview", "files", "chat", "architecture", "onboarding"],
      default: "overview",
    },
    ai: { type: AIPreferencesSchema, default: () => ({}) },
    autoGenerate: { type: AutoGeneratePreferencesSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const UserSettings: Model<UserSettingsDocument> =
  models.UserSettings ||
  model<UserSettingsDocument>("UserSettings", UserSettingsSchema);
