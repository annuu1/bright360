// src/app/admin/create-test/page.tsx
"use client";
import { useState } from "react";

export default function CreateTestPage() {
  const [title, setTitle] = useState("");
  const [count, setCount] = useState(10);
  const [subjectId, setSubjectId] = useState("");
  const [msg, setMsg] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const body: any = { title, randomFrom: true, count };
    if (subjectId) body.subjectId = subjectId;
    const res = await fetch("/api/admin/createTest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (data.error) setMsg("Error: " + data.error);
    else setMsg("Created test: " + data.testId);
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-3">Create Test (random questions)</h2>
      <form onSubmit={handleCreate} className="flex flex-col gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Test title" className="p-2 border rounded" />
        <input type="number" value={count} onChange={(e) => setCount(parseInt(e.target.value || "10"))} min={1} className="p-2 border rounded" />
        <input value={subjectId} onChange={(e) => setSubjectId(e.target.value)} placeholder="subjectId (optional)" className="p-2 border rounded" />
        <button className="w-full bg-green-600 text-white py-2 rounded">Create</button>
      </form>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
    </div>
  );
}
