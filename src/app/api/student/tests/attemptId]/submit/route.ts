import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import TestAttempt from "@/models/TestAttempt";
import Question from "@/models/Question";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request, { params }: { params: { attemptId: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const body = await req.json();
  const answers: Record<string, number> = body.answers || {};

  const attempt = await TestAttempt.findById(params.attemptId).populate("questions");
  if (!attempt || attempt.student.toString() !== token.sub) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let correct = 0;
  let attempted = 0;
  const details: any[] = [];

  for (const q of attempt.questions as any[]) {
    const given = answers[q._id] ?? null;
    const isCorrect = given !== null && given === q.correctOptionIndex;
    if (given !== null) attempted++;
    if (isCorrect) correct++;

    details.push({
      questionId: q._id,
      given,
      correct: q.correctOptionIndex,
      isCorrect,
    });
  }

  const total = attempt.questions.length;
  const accuracy = total > 0 ? (correct / total) * 100 : 0;

  attempt.status = "completed";
  attempt.answers = details;
  attempt.result = { correct, attempted, total, accuracy };
  await attempt.save();

  return NextResponse.json({ result: attempt.result });
}
