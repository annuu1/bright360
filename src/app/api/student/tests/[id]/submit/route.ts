import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import TestAttempt from "@/models/TestAttempt";
import Question from "@/models/Question";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const { answers } = await req.json(); // { questionId: selectedOptionIndex }

  const attempt = await TestAttempt.findById(params.id).populate("questions");
  if (!attempt) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let correct = 0;
  let attempted = 0;
  const answerRecords = [];

  for (const q of attempt.questions as any[]) {
    const selectedOption = answers[q._id] ?? null;
    const isCorrect = selectedOption !== null && selectedOption === q.correctOptionIndex;
    if (selectedOption !== null) attempted++;
    if (isCorrect) correct++;

    answerRecords.push({
      question: q._id,
      selectedOption,
      correctOption: q.correctOptionIndex,
      isCorrect,
    });
  }

  attempt.answers = answerRecords;
  attempt.submittedAt = new Date();
  attempt.score = {
    correct,
    attempted,
    total: attempt.questions.length,
    accuracy: attempted ? (correct / attempted) * 100 : 0,
  };

  await attempt.save();

  return NextResponse.json({ result: attempt.score, attemptId: attempt._id });
}
