import { Schema, model, models, type Document, type Model } from "mongoose";

export type HealthRating = "Excellent" | "Good" | "Average" | "Poor";

export interface RepositoryHealth {
  score: number;
  testCoverage: HealthRating;
  documentation: HealthRating;
  typeSafety: HealthRating;
}

export interface RepositoryDocument extends Document {
  userId: string;
  repoUrl: string;
  repoName: string;
  repoId: string;
  owner: string;
  repo: string;
  branch: string;
  overview: string;
  architectureDiagram: string;
  onboardingGuide: string;
  repositoryHealth: RepositoryHealth;
  totalFiles: number;
  analyzedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RepositoryHealthSchema = new Schema<RepositoryHealth>(
  {
    score: { type: Number, required: true },
    testCoverage: { type: String, required: true },
    documentation: { type: String, required: true },
    typeSafety: { type: String, required: true },
  },
  { _id: false }
);

const RepositorySchema = new Schema<RepositoryDocument>(
  {
    userId: { type: String, required: true },
    repoUrl: { type: String, required: true },
    // Display name, e.g. "vercel/ms" — distinct from `repoId`, which is the
    // opaque base64url-encoded {owner, repo, branch} used for routing/API calls.
    repoName: { type: String, required: true },
    repoId: { type: String, required: true },
    owner: { type: String, required: true },
    repo: { type: String, required: true },
    branch: { type: String, required: true },
    overview: { type: String, default: "" },
    architectureDiagram: { type: String, default: "" },
    onboardingGuide: { type: String, default: "" },
    repositoryHealth: { type: RepositoryHealthSchema, required: true },
    totalFiles: { type: Number, default: 0 },
    analyzedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One cached analysis per user per repository (owner+repo, independent of
// how the URL was typed — with/without ".git", trailing slash, etc).
RepositorySchema.index({ userId: 1, owner: 1, repo: 1 }, { unique: true });
RepositorySchema.index({ userId: 1, analyzedAt: -1 });

export const Repository: Model<RepositoryDocument> =
  models.Repository ||
  model<RepositoryDocument>("Repository", RepositorySchema);
