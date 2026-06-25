import {
  Schema,
  model,
  models,
  Types,
  type Document,
  type Model,
} from "mongoose";

export interface OnboardingGuideDocument extends Document {
  userId: string;
  repoId: Types.ObjectId;
  repoName: string;
  content: string;
  createdAt: Date;
}

const OnboardingGuideSchema = new Schema<OnboardingGuideDocument>(
  {
    userId: { type: String, required: true },
    repoId: { type: Schema.Types.ObjectId, ref: "Repository", required: true },
    repoName: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

OnboardingGuideSchema.index({ userId: 1, repoId: 1, createdAt: -1 });

export const OnboardingGuide: Model<OnboardingGuideDocument> =
  models.OnboardingGuide ||
  model<OnboardingGuideDocument>("OnboardingGuide", OnboardingGuideSchema);
