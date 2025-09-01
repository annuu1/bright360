import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import TestAttempt from "@/models/TestAttempt";
import { getToken } from "next-auth/jwt";

export async function GET(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const attempts = await TestAttempt.find({ student: token.sub })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return NextResponse.json(attempts);
}
