"use client";

import { useSession } from "next-auth/react";

export default function StudentPage() {
  const { data: session } = useSession();

  return (
    <div className="text-center mt-12">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      <p className="mt-4">Welcome, {session?.user?.name}</p>
      <p className="mt-2 text-gray-600">
        Role: {(session?.user as any)?.role} | Plan: {(session?.user as any)?.plan}
      </p>
    </div>
  );
}
