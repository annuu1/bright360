import Attempt from "@/models/Attempt";
import Question from "@/models/Question";
import { dbConnect } from "@/lib/mongodb";

export async function POST(req: Request) {
  await dbConnect();
  const { studentId, testId, answers, startedAt } = await req.json();
  // answers: [{questionId, selectedIndex, timeTakenSec}, ...]
  let score = 0;
  const details = [];

  for (const a of answers) {
    const q = await Question.findById(a.questionId);
    const correct = q && q.correctOptionIndex === a.selectedIndex;
    if (correct) score += 1;
    details.push({ question: a.questionId, selectedIndex: a.selectedIndex, correct, timeTakenSec: a.timeTakenSec });
  }

  const attempt = await Attempt.create({
    student: studentId,
    test: testId,
    questions: details,
    score,
    total: answers.length,
    startedAt,
    finishedAt: new Date(),
  });

  // Optionally: update student's completed chapters if they completed test covering a chapter

  return new Response(JSON.stringify({ attemptId: attempt._id, score }));
}
