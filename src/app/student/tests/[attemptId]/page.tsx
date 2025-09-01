"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Question = {
  _id: string;
  text: string;
  options: { text: string }[];
  correctOptionIndex: number;
};

export default function AttemptPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/student/tests/${attemptId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions || []);
        const initial: Record<string, number | null> = {};
        (data.questions || []).forEach((q: Question) => {
          initial[q._id] = null;
        });
        setAnswers(initial);
      });
  }, [attemptId]);

  function selectAnswer(qId: string, index: number) {
    setAnswers((prev) => ({ ...prev, [qId]: index }));
  }

  async function submitTest() {
    const res = await fetch(`/api/student/tests/${attemptId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    if (data.result) {
      setResult(data.result);
      setSubmitted(true);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Test Attempt</h1>

      {questions.map((q, i) => (
        <Card key={q._id}>
          <CardHeader>
            <CardTitle>
              Q{i + 1}. {q.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={q._id}
                    checked={answers[q._id] === idx}
                    onChange={() => selectAnswer(q._id, idx)}
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {!submitted ? (
        <Button onClick={submitTest}>Submit Test</Button>
      ) : (
        <div className="p-4 border rounded bg-muted">
          <h2 className="text-xl font-semibold">Result</h2>
          <p>Correct: {result.correct}</p>
          <p>Attempted: {result.attempted}</p>
          <p>Total: {result.total}</p>
          <p>Accuracy: {result.accuracy.toFixed(2)}%</p>

          <Button className="mt-4" onClick={() => router.push("/student/tests/history")}>
            View History
          </Button>
        </div>
      )}
    </div>
  );
}
