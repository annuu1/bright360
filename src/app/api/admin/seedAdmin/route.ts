// src/app/api/admin/seedAdmin/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const { name, email, password } = body || {};
  if (!name || !email || !password) return NextResponse.json({ error: "name,email,password required" }, { status: 400 });

  const exists = await User.findOne({ email });
  if (exists) return NextResponse.json({ error: "Admin already exists" }, { status: 400 });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role: "admin" });

  return NextResponse.json({ ok: true, id: user._id });
}
