import {
  Schema,
  model,
  models,
  Types,
  type Document,
  type Model,
} from "mongoose";

export interface SummaryHistoryDocument extends Document {
  userId: string;
  repoId: Types.ObjectId;
  filePath: string;
  content: string;
  createdAt: Date;
}

const SummaryHistorySchema = new Schema<SummaryHistoryDocument>(
  {
    userId: { type: String, required: true },
    repoId: { type: Schema.Types.ObjectId, ref: "Repository", required: true },
    filePath: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

SummaryHistorySchema.index({ userId: 1, createdAt: -1 });
SummaryHistorySchema.index({ repoId: 1, filePath: 1 });

export const SummaryHistory: Model<SummaryHistoryDocument> =
  models.SummaryHistory ||
  model<SummaryHistoryDocument>("SummaryHistory", SummaryHistorySchema);
