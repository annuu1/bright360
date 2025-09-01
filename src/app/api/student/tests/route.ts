// src/app/api/student/tests/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Test from "@/models/Test";
import Question from "@/models/Question";

export async function GET(req: Request) {
  await dbConnect();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const random = url.searchParams.get("random");
  const count = parseInt(url.searchParams.get("count") || "10", 10);

  if (id) {
    const test = await Test.findById(id).populate("questions");
    if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ test });
  }

  if (random === "1") {
    // generate random questions (for quick practice)
    const qs = await Question.aggregate([{ $sample: { size: count } }]);
    return NextResponse.json({ questions: qs });
  }

  // default: list saved tests (paginated can be added)
  const tests = await Test.find({}).limit(50).sort({ createdAt: -1 });
  return NextResponse.json({ tests });
}
