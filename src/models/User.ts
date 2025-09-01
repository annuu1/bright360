import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "student";
  plan: "free" | "premium";
}

const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student"], default: "student" },
  plan: { type: String, enum: ["free", "premium"], default: "free" },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
