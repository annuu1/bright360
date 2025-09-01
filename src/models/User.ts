// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "student";
  class?: string;
  subjects?: mongoose.Types.ObjectId[];
  completedChapters?: { subject: mongoose.Types.ObjectId; chapter: mongoose.Types.ObjectId }[];
  plan?: "free" | "premium";
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student"], default: "student" },
  class: String,
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  completedChapters: [
    {
      subject: { type: Schema.Types.ObjectId, ref: "Subject" },
      chapter: { type: Schema.Types.ObjectId, ref: "Chapter" },
    },
  ],
  plan: { type: String, enum: ["free", "premium"], default: "free" },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
