import {
  Schema,
  model,
  models,
  Types,
  type Document,
  type Model,
} from "mongoose";

export type ChatRole = "user" | "assistant";

export interface ChatDocument extends Document {
  userId: string;
  repositoryId: Types.ObjectId;
  role: ChatRole;
  content: string;
  createdAt: Date;
}

const ChatSchema = new Schema<ChatDocument>(
  {
    userId: { type: String, required: true },
    repositoryId: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ChatSchema.index({ repositoryId: 1, createdAt: 1 });
ChatSchema.index({ userId: 1 });

export const Chat: Model<ChatDocument> =
  models.Chat || model<ChatDocument>("Chat", ChatSchema);
