import mongoose, { Schema } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "admin"|"student";
  class?: string;            // e.g., "10th"
  subjects?: mongoose.Types.ObjectId[]; // enrolled subjects
  completedChapters?: { subject: mongoose.Types.ObjectId; chapter: mongoose.Types.ObjectId }[];
  plan?: "free"|"premium";
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student"], default: "student" },
  class: { type: String },
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  completedChapters: [{ subject: { type: Schema.Types.ObjectId, ref: "Subject" }, chapter: { type: Schema.Types.ObjectId, ref: "Chapter" } }],
  plan: { type: String, enum: ["free", "premium"], default: "free" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
