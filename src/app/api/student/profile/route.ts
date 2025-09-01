// src/app/api/student/profile/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Student from "@/models/Student";
import { getToken } from "next-auth/jwt";

export async function GET(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const student = await Student.findOne({ user: token.sub })
    .populate("subjects")
    .populate("completedChapters.subject")
    .populate("completedChapters.chapter");

  return NextResponse.json({ student });
}

export async function POST(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const body = await req.json();

  const student = await Student.create({
    user: token.sub,
    name: body.name,
    class: body.class,
    subjects: body.subjects || [],
  });

  return NextResponse.json({ student });
}

export async function PUT(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const body = await req.json();

  const student = await Student.findOneAndUpdate(
    { user: token.sub },
    {
      $set: {
        name: body.name,
        class: body.class,
        subjects: body.subjects || [],
        completedChapters: body.completedChapters || [],
      },
    },
    { new: true }
  )
    .populate("subjects")
    .populate("completedChapters.subject")
    .populate("completedChapters.chapter");


  return NextResponse.json({ student });
}

export async function DELETE(req: Request) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  await Student.findOneAndDelete({ user: token.sub });

  return NextResponse.json({ success: true });
}
