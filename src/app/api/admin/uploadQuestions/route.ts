import { dbConnect } from "@/lib/mongodb";
import Question from "@/models/Question";
import Subject from "@/models/Subject";
import Chapter from "@/models/Chapter";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json(); // body is array of questions
  const adminId = "..." // get from session/token (implement auth)
  const created: any[] = [];

  for (const q of body) {
    // find or create subject
    let subject = await Subject.findOne({ name: q.subject, class: q.class || "default" });
    if (!subject) subject = await Subject.create({ name: q.subject, class: q.class || "default" });

    // find or create chapter
    let chapter = await Chapter.findOne({ name: q.chapter, subject: subject._id });
    if (!chapter) chapter = await Chapter.create({ name: q.chapter, subject: subject._id });

    const newQ = await Question.create({
      text: q.text,
      options: q.options.map((t: string) => ({ text: t })),
      correctOptionIndex: q.correctOptionIndex,
      subject: subject._id,
      chapter: chapter._id,
      tags: q.tags || [],
      difficulty: q.difficulty || "medium",
      createdBy: adminId,
    });
    created.push(newQ);
  }

  return NextResponse.json({ inserted: created.length });
}
