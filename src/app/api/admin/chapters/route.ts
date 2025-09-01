import { NextResponse } from "next/server";
import {dbConnect} from "@/lib/mongodb";
import Chapter from "@/models/Chapter";

// GET all chapters
export async function GET() {
  try {
    await dbConnect();
    const chapters = await Chapter.find().populate("subject").exec();
    return NextResponse.json(chapters, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/chapters error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapters", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST new chapter
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, subjectId, order } = body;

    if (!name || !subjectId) {
      return NextResponse.json(
        { error: "Name and subjectId are required" },
        { status: 400 }
      );
    }

    const chapter = await Chapter.create({
      name,
      subject: subjectId,
      order: order ?? 0,
    });

    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/chapters error:", error);
    return NextResponse.json(
      { error: "Failed to create chapter", details: (error as Error).message },
      { status: 500 }
    );
  }
}
