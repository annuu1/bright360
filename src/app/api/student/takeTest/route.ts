// src/app/api/student/takeTest/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Attempt from "@/models/Attempt";
import Question from "@/models/Question";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "student") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const body = await req.json();
  const { testId, answers, startedAt } = body;
  if (!Array.isArray(answers) || answers.length === 0) return NextResponse.json({ error: "No answers" }, { status: 400 });

  let score = 0;
  const details: any[] = [];

  // Fetch all questions used to avoid many DB calls; map by id
  const qids = answers.map((a: any) => a.questionId);
  const questions = await Question.find({ _id: { $in: qids } });
  const qMap: Record<string, any> = {};
  for (const q of questions) qMap[q._id.toString()] = q;

  for (const a of answers) {
    const q = qMap[a.questionId];
    const correct = q && q.correctOptionIndex === a.selectedIndex;
    if (correct) score += 1;
    details.push({ question: a.questionId, selectedIndex: a.selectedIndex, correct: !!correct, timeTakenSec: a.timeTakenSec || 0 });
  }

  const attempt = await Attempt.create({
    student: token.sub,
    test: testId,
    questions: details,
    score,
    total: answers.length,
    startedAt: startedAt ? new Date(startedAt) : new Date(),
    finishedAt: new Date(),
  });

  return NextResponse.json({ attemptId: attempt._id, score, total: answers.length });
}
