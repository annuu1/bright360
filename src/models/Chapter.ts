// src/models/Chapter.ts
import mongoose, { Schema } from "mongoose";

const ChapterSchema = new Schema({
  name: { type: String, required: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  order: { type: Number, default: 0 },
});

export default mongoose.models.Chapter || mongoose.model("Chapter", ChapterSchema);
