// src/app/api/admin/uploadQuestions/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Subject from "@/models/Subject";
import Chapter from "@/models/Chapter";
import Question from "@/models/Question";
import { getToken } from "next-auth/jwt";

type RawQ = {
  text: string;
  options: string[];
  correctOptionIndex: number;
  subject: string;
  chapter: string;
  class?: string;
  tags?: string[];
  difficulty?: "easy" | "medium" | "hard";
  source?: string;
};

export async function POST(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  let body: RawQ[];
  try {
    body = await req.json();
    if (!Array.isArray(body)) throw new Error("Expected an array");
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid JSON: " + (err.message || err) }, { status: 400 });
  }

  const inserted: any[] = [];
  const errors: any[] = [];

  for (let i = 0; i < body.length; i++) {
    const q = body[i];
    // Basic validation
    if (!q.text || !Array.isArray(q.options) || q.options.length < 2 || typeof q.correctOptionIndex !== "number") {
      errors.push({ i, reason: "Missing required fields or options < 2" });
      continue;
    }
    if (q.correctOptionIndex < 0 || q.correctOptionIndex >= q.options.length) {
      errors.push({ i, reason: "correctOptionIndex out of bounds" });
      continue;
    }

    // Find or create subject
    const subjectName = q.subject?.trim() || "General";
    const className = q.class?.trim() || "default";
    let subject = await Subject.findOne({ name: subjectName, class: className });
    if (!subject) subject = await Subject.create({ name: subjectName, class: className });

    // Find or create chapter
    const chapterName = q.chapter?.trim() || "General";
    let chapter = await Chapter.findOne({ name: chapterName, subject: subject._id });
    if (!chapter) chapter = await Chapter.create({ name: chapterName, subject: subject._id });

    const newQ = await Question.create({
      text: q.text,
      options: q.options.map((t) => ({ text: t })),
      correctOptionIndex: q.correctOptionIndex,
      subject: subject._id,
      chapter: chapter._id,
      tags: q.tags || [],
      difficulty: q.difficulty || "medium",
      createdBy: token.sub,
      source: q.source,
    });

    inserted.push(newQ._id);
  }

  return NextResponse.json({ insertedCount: inserted.length, errors });
}
