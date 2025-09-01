import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  const { name, email, password } = await req.json();
  const exists = await User.findOne({ email });
  if (exists) return new Response(JSON.stringify({ msg: "exists" }), { status: 400 });
  const hash = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hash, role: "admin" });
  return new Response(JSON.stringify({ msg: "ok" }));
}
