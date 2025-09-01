// src/app/api/admin/analytics/studentProgress/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Attempt from "@/models/Attempt";
import { getToken } from "next-auth/jwt";

export async function GET(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  // Simple report: for each student => total attempts, avg score
  const agg = await Attempt.aggregate([
    { $group: { _id: "$student", attempts: { $sum: 1 }, avgScore: { $avg: { $cond: [{ $ifNull: ["$score", false] }, { $multiply: [{ $divide: ["$score", "$total"] }, 100] }, 0] } } } },
    { $limit: 1000 },
  ]);

  // populate students
  const userIds = agg.map(a => a._id);
  const users = await User.find({ _id: { $in: userIds } }).select("name email class");
  const userMap: Record<string, any> = {};
  for (const u of users) userMap[u._id.toString()] = u;

  const result = agg.map(a => ({ studentId: a._id, name: userMap[a._id.toString()]?.name || "Unknown", email: userMap[a._id.toString()]?.email, attempts: a.attempts, avgScorePct: a.avgScore || 0 }));
  return NextResponse.json({ result });
}
