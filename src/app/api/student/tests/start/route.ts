import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Question from "@/models/Question";
import Test from "@/models/Test";
import TestAttempt from "@/models/TestAttempt";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const { class: className, subject, chapter, difficulty } = await req.json();

  // Build filter for random questions
  const filter: any = {};
  if (className) filter.class = className;
  if (subject) filter.subject = subject;
  if (chapter) filter.chapter = chapter;
  if (difficulty) filter.difficulty = difficulty;

  // Pick up to 20 random questions
  const questions = await Question.aggregate([
    { $match: filter },
    { $sample: { size: 20 } },
  ]);

  if (questions.length === 0) {
    return NextResponse.json({ error: "No questions available" }, { status: 404 });
  }

  // Create a TestAttempt
  const attempt = await TestAttempt.create({
    student: token.sub,
    questions: questions.map((q) => q._id),
    status: "in-progress",
  });

  return NextResponse.json({ attemptId: attempt._id });
}
