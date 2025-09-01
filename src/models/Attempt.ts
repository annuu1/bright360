// src/models/Attempt.ts
import mongoose, { Schema } from "mongoose";

const AttemptSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    test: { type: Schema.Types.ObjectId, ref: "Test" },
    questions: [
      {
        question: { type: Schema.Types.ObjectId, ref: "Question" },
        selectedIndex: Number,
        correct: Boolean,
        timeTakenSec: Number,
      },
    ],
    score: Number,
    total: Number,
    startedAt: Date,
    finishedAt: Date,
  },
  { timestamps: true }
);

AttemptSchema.index({ student: 1, test: 1 });
export default mongoose.models.Attempt || mongoose.model("Attempt", AttemptSchema);
