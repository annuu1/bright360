import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import TestAttempt from "@/models/TestAttempt";
import { getToken } from "next-auth/jwt";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const attempt = await TestAttempt.findById(params.id)
    .populate("questions")
    .lean();
  if (!attempt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(attempt);
}
