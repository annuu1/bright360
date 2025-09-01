// src/models/Student.ts
import mongoose, { Schema } from "mongoose";

const StudentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // link to Auth user
    name: { type: String, required: true },
    class: { type: String, required: true }, // e.g. "8", "9", "10"
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }], // enrolled subjects
    
    completedChapters: [
      {
        subject: { type: Schema.Types.ObjectId, ref: "Subject" },
        chapter: { type: Schema.Types.ObjectId, ref: "Chapter" },
        completedAt: { type: Date, default: Date.now },
      },
    ],
    stats: {
      testsTaken: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }, // percentage
      totalCorrectAnswers: { type: Number, default: 0 },
      totalQuestionsAttempted: { type: Number, default: 0 },
    },
    
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
