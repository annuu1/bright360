// src/models/Test.ts
import mongoose, { Schema } from "mongoose";

const TestSchema = new Schema(
  {
    title: String,
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    durationMinutes: Number,
    class: String,
    subject: { type: Schema.Types.ObjectId, ref: "Subject" },
    chapter: { type: Schema.Types.ObjectId, ref: "Chapter" },
    meta: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.models.Test || mongoose.model("Test", TestSchema);
