// src/app/api/admin/createTest/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Test from "@/models/Test";
import Question from "@/models/Question";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const body = await req.json();
  const { title, questionIds, randomFrom, count, durationMinutes, class: className, subjectId, chapterId } = body;

  let questionList: any[] = [];

  if (Array.isArray(questionIds) && questionIds.length > 0) {
    // validate existing questions
    const qs = await Question.find({ _id: { $in: questionIds } }).limit(1000);
    questionList = qs.map((q) => q._id);
  } else if (randomFrom && count) {
    // random selection by filter
    const filter: any = {};
    if (className) filter["class"] = className;
    if (subjectId) filter.subject = subjectId;
    if (chapterId) filter.chapter = chapterId;

    // pick random using aggregation
    const sample = await Question.aggregate([{ $match: filter }, { $sample: { size: parseInt(count, 10) } }]);
    questionList = sample.map((s) => s._id);
  } else {
    return NextResponse.json({ error: "Provide questionIds or randomFrom+count" }, { status: 400 });
  }

  const test = await Test.create({
    title: title || `Test ${new Date().toISOString()}`,
    questions: questionList,
    createdBy: token.sub,
    durationMinutes: durationMinutes || 0,
    class: className,
    subject: subjectId,
    chapter: chapterId,
  });

  return NextResponse.json({ ok: true, testId: test._id });
}
