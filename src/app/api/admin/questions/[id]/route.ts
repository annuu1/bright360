import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Question from "@/models/Question";
import { getToken } from "next-auth/jwt";

// 📌 PUT (update)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();

  const updated = await Question.findByIdAndUpdate(
    params.id,
    { ...body, options: body.options.map((t: string) => ({ text: t })) },
    { new: true }
  );

  return NextResponse.json(updated);
}

// 📌 DELETE
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  await Question.findByIdAndDelete(params.id);

  return NextResponse.json({ success: true });
}
