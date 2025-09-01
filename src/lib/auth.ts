// src/lib/auth.ts
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function getServerToken(req: NextRequest | { headers: any }) {
  return await getToken({ req: (req as any), secret: process.env.NEXTAUTH_SECRET });
}
