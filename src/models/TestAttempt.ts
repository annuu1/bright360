import mongoose, { Schema } from "mongoose";

const TestAttemptSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: "Question" },
        given: { type: Number, default: null },
        correct: Number,
        isCorrect: Boolean,
      },
    ],
    result: {
      correct: Number,
      attempted: Number,
      total: Number,
      accuracy: Number,
    },
    status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" },
  },
  { timestamps: true }
);

export default mongoose.models.TestAttempt || mongoose.model("TestAttempt", TestAttemptSchema);
