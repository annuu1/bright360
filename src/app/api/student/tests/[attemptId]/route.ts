import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import TestAttempt from "@/models/TestAttempt";
import Question from "@/models/Question";
import { getToken } from "next-auth/jwt";

export async function GET(req: Request, { params }: { params: { attemptId: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const attempt = await TestAttempt.findById(params.attemptId).populate("questions");
  if (!attempt || attempt.student.toString() !== token.sub) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    attemptId: attempt._id,
    questions: attempt.questions.map((q: any) => ({
      _id: q._id,
      text: q.text,
      options: q.options,
    })),
  });
}
