// src/models/Subject.ts
import mongoose, { Schema } from "mongoose";

const SubjectSchema = new Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],
});

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);
