// src/app/admin/upload/page.tsx
"use client";
import { useState } from "react";

export default function UploadQuestionsPage() {
  const [jsonText, setJsonText] = useState("");
  const [message, setMessage] = useState("");

  async function handlePasteSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const arr = JSON.parse(jsonText);
      const res = await fetch("/api/admin/uploadQuestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arr),
      });
      const data = await res.json();
      if (data.error) setMessage("Error: " + data.error);
      else setMessage(`Inserted ${data.insertedCount} questions. ${data.errors?.length || 0} errors.`);
    } catch (err: any) {
      setMessage("Invalid JSON");
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setJsonText(text);
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-2">Upload Question Bank (JSON)</h2>
      <input type="file" accept=".json,application/json" onChange={handleFile} className="mb-2" />
      <form onSubmit={handlePasteSubmit} className="flex flex-col gap-3">
        <textarea
          className="w-full min-h-[220px] p-3 border rounded text-sm"
          placeholder='Paste JSON array here or use file upload'
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Upload</button>
      </form>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}
