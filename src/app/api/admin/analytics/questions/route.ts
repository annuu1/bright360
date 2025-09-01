// src/app/api/admin/analytics/questions/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Attempt from "@/models/Attempt";
import { getToken } from "next-auth/jwt";
import Question from "@/models/Question";

export async function GET(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const agg = await Attempt.aggregate([
    { $unwind: "$questions" },
    { $group: {
      _id: "$questions.question",
      attempts: { $sum: 1 },
      wrong: { $sum: { $cond: [{ $eq: ["$questions.correct", false] }, 1, 0] } },
      correct: { $sum: { $cond: [{ $eq: ["$questions.correct", true] }, 1, 0] } },
    }},
    { $project: { attempts: 1, wrong: 1, correct: 1, wrongPct: { $cond: [{ $eq: ["$attempts", 0] }, 0, { $multiply: [{ $divide: ["$wrong", "$attempts"] }, 100] }] } } },
    { $sort: { wrongPct: -1, attempts: -1 } },
    { $limit: 50 },
  ]);

  // Populate question text
  const ids = agg.map((a: any) => a._id);
  const questions = await Question.find({ _id: { $in: ids } }).select("text");
  const qMap: Record<string, any> = {};
  for (const q of questions) qMap[q._id.toString()] = q.text;

  const result = agg.map((a: any) => ({ questionId: a._id, text: qMap[a._id.toString()], attempts: a.attempts, wrong: a.wrong, correct: a.correct, wrongPct: a.wrongPct }));
  return NextResponse.json({ result });
}
