import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/mongodb";
import Subject from "@/models/Subject";

// GET all subjects
export async function GET() {
  try {
    await dbConnect();
    const subjects = await Subject.find().populate("chapters").exec();
    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}

// POST new subject
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, class: className } = body;

    if (!name || !className) {
      return NextResponse.json({ error: "Name and class are required" }, { status: 400 });
    }

    const subject = await Subject.create({ name, class: className });
    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}
