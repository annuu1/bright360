"use client";
import { useState } from "react";

export default function UploadQuestionsPage() {
  const [jsonText, setJsonText] = useState("");
  const [message, setMessage] = useState("");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    try {
      const arr = JSON.parse(jsonText);
      const res = await fetch("/api/admin/uploadQuestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arr),
      });
      const data = await res.json();
      setMessage(`Inserted ${data.inserted} questions`);
    } catch (err: any) {
      setMessage("Invalid JSON or server error: " + err.message);
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-2">Upload Question Bank (JSON)</h2>
      <form onSubmit={handleUpload} className="flex flex-col gap-3">
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder='Paste JSON array here (see example in docs)'
          className="w-full min-h-[260px] p-3 border rounded text-sm"
        />
        <button className="bg-blue-600 text-white py-2 rounded">Upload</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
