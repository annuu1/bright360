// src/models/Question.ts
import mongoose, { Schema } from "mongoose";

const OptionSchema = new Schema({ text: String }, { _id: false });

const QuestionSchema = new Schema(
  {
    text: { type: String, required: true },
    options: [OptionSchema],
    correctOptionIndex: { type: Number, required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject" },
    chapter: { type: Schema.Types.ObjectId, ref: "Chapter" },
    tags: [String],
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    source: String,
  },
  { timestamps: true }
);

QuestionSchema.index({ subject: 1, chapter: 1 });

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
