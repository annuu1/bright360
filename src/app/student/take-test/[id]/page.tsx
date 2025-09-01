"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TakeTest({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/student/tests?id=${params.id}`).then(r => r.json()).then(data => setQuestions(data.questions));
  }, [params.id]);

  function selectOption(optIndex: number) {
    const q = questions[index];
    const existing = answers.find(a => a.questionId === q._id);
    const payload = { questionId: q._id, selectedIndex: optIndex, timeTakenSec: 12 }; // time placeholder
    if (existing) {
      setAnswers(prev => prev.map(a => a.questionId === q._id ? payload : a));
    } else setAnswers(prev => [...prev, payload]);
    if (index < questions.length - 1) setIndex(index + 1);
  }

  async function handleSubmit() {
    const res = await fetch("/api/student/takeTest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: (session?.user as any)?.id, testId: params.id, answers, startedAt: new Date() }),
    });
    const data = await res.json();
    router.push(`/student/result/${data.attemptId}`);
  }

  if (questions.length === 0) return <p>Loading...</p>;

  const q = questions[index];
  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium">{index + 1}. {q.text}</h3>
        <div className="mt-3 flex flex-col gap-2">
          {q.options.map((o: any, i: number) => (
            <button key={i} className="text-left p-3 border rounded" onClick={() => selectOption(i)}>
              {o.text}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex justify-between">
        <button disabled={index===0} onClick={() => setIndex(i => Math.max(0, i-1))} className="px-4 py-2 border rounded">Prev</button>
        {index === questions.length - 1 ? (
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
        ) : (
          <button onClick={() => setIndex(i => Math.min(questions.length-1, i+1))} className="px-4 py-2 border rounded">Next</button>
        )}
      </div>
    </div>
  );
}
