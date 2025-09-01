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

// 📌 GET (with filters + pagination)
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const filters: any = {};
    if (searchParams.get("subject")) filters.subject = searchParams.get("subject");
    if (searchParams.get("chapter")) filters.chapter = searchParams.get("chapter");
    if (searchParams.get("difficulty")) filters.difficulty = searchParams.get("difficulty");

    // For class filter → join via Subject
    if (searchParams.get("class")) {
      const subjects = await Subject.find({ class: searchParams.get("class") });
      filters.subject = { $in: subjects.map((s) => s._id) };
    }

    const total = await Question.countDocuments(filters);
    const questions = await Question.find(filters)
      .populate("subject")
      .populate("chapter")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({ total, page, limit, questions });
  } catch (err) {
    console.error("GET /api/admin/questions error:", err);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

// 📌 POST (bulk upload or single add)
export async function POST(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  let body: RawQ[] | RawQ;
  try {
    body = await req.json();
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid JSON: " + (err.message || err) }, { status: 400 });
  }

  // Normalize into array (so both bulk + single works)
  const inputArray = Array.isArray(body) ? body : [body];
  const inserted: any[] = [];
  const errors: any[] = [];

  for (let i = 0; i < inputArray.length; i++) {
    const q = inputArray[i];

    // ✅ Validation
    if (!q.text || !Array.isArray(q.options) || q.options.length < 2 || typeof q.correctOptionIndex !== "number") {
      errors.push({ i, reason: "Missing required fields or options < 2" });
      continue;
    }
    if (q.correctOptionIndex < 0 || q.correctOptionIndex >= q.options.length) {
      errors.push({ i, reason: "correctOptionIndex out of bounds" });
      continue;
    }

    // ✅ Subject
    const subjectName = q.subject?.trim() || "General";
    const className = q.class?.trim() || "default";
    let subject = await Subject.findOne({ name: subjectName, class: className });
    if (!subject) subject = await Subject.create({ name: subjectName, class: className });

    // ✅ Chapter
    const chapterName = q.chapter?.trim() || "General";
    let chapter = await Chapter.findOne({ name: chapterName, subject: subject._id });
    if (!chapter) chapter = await Chapter.create({ name: chapterName, subject: subject._id });

    // ✅ Save Question
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
