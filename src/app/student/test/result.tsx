"use client";

import { useSearchParams } from "next/navigation";

export default function ResultPage() {
  const params = useSearchParams();
  const score = params.get("score");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">🎉 Test Completed!</h1>
      <p className="mt-4 text-lg">Your Score: {score}</p>
      <a
        href="/student"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Back to Dashboard
      </a>
    </div>
  );
}
