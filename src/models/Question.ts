import mongoose, { Schema } from "mongoose";

const QuestionSchema = new Schema({
  text: { type: String, required: true },
  options: [{ text: String, _id: false }], // array of option objects { text }
  correctOptionIndex: { type: Number, required: true }, // index in options array
  subject: { type: Schema.Types.ObjectId, ref: "Subject" },
  chapter: { type: Schema.Types.ObjectId, ref: "Chapter" },
  tags: [String],
  difficulty: { type: String, enum: ["easy","medium","hard"], default: "medium" },
  source: String, // optional
  createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // admin who uploaded
}, { timestamps: true });

QuestionSchema.index({ subject: 1, chapter: 1 });

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
