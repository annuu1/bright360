"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

type Question = {
  _id: string;
  text: string;
  options: string[];
};

export default function StudentTestPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [qid: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // ✅ Fetch questions when page loads
  useEffect(() => {
    async function fetchQuestions() {
      const res = await fetch("/api/test?class=10&subject=Math&chapter=Algebra");
      const data = await res.json();
      setQuestions(data.questions);
      setLoading(false);
    }
    fetchQuestions();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading questions...</p>;

  const handleSelect = (qid: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent((c) => c + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/test/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: "s123", // later take from session
        answers,
        testMeta: {
          class: "10",
          subject: "Math",
          chapter: "Algebra",
        },
      }),
    });

    const result = await res.json();
    window.location.href = `/student/test/result?score=${result.score}`;
  };

  const q = questions[current];

  return (
    <div className="max-w-xl mx-auto p-4">
      <Progress value={((current + 1) / questions.length) * 100} className="mb-4" />
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-3">
          Q{current + 1}. {q.text}
        </h2>
        <RadioGroup
          value={answers[q._id] || ""}
          onValueChange={(val) => handleSelect(q._id, val)}
        >
          {q.options.map((opt, idx) => (
            <div key={idx} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
              <RadioGroupItem value={opt} id={`${q._id}-${idx}`} />
              <label htmlFor={`${q._id}-${idx}`}>{opt}</label>
            </div>
          ))}
        </RadioGroup>
      </Card>

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={handlePrev} disabled={current === 0}>
          Previous
        </Button>
        {current < questions.length - 1 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>Submit Test</Button>
        )}
      </div>
    </div>
  );
}
