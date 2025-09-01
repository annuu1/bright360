// src/lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Please set MONGODB_URI in .env.local");

declare global {
  // eslint-disable-next-line
  var _mongo_cached: { conn: any; promise: any } | undefined;
}

const cached = global._mongo_cached || (global._mongo_cached = { conn: null, promise: null });

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
