"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StudentTestsPage() {
  const router = useRouter();

  const [classes, setClasses] = useState<string[]>(["8", "9", "10", "default"]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");

  // fetch subjects whenever class changes
  useEffect(() => {
    if (!selectedClass) return;
    fetch(`/api/admin/subjects?class=${selectedClass}`)
      .then((res) => res.json())
      .then((data) => setSubjects(data || []));
  }, [selectedClass]);

  // fetch chapters whenever subject changes
  useEffect(() => {
    if (!selectedSubject) return;
    fetch(`/api/admin/chapters?subject=${selectedSubject}`)
      .then((res) => res.json())
      .then((data) => setChapters(data || []));
  }, [selectedSubject]);

  async function startTest() {
    const res = await fetch("/api/student/tests/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        class: selectedClass,
        subject: selectedSubject,
        chapter: selectedChapter,
        difficulty,
      }),
    });

    const data = await res.json();
    if (data.attemptId) {
      router.push(`/student/tests/${data.attemptId}`);
    } else {
      alert(data.error || "Failed to start test");
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Start a Test</h1>

      {/* Class Filter */}
      <Select onValueChange={setSelectedClass} value={selectedClass}>
        <SelectTrigger>
          <SelectValue placeholder="Select Class" />
        </SelectTrigger>
        <SelectContent>
          {classes.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Subject Filter */}
      <Select onValueChange={setSelectedSubject} value={selectedSubject}>
        <SelectTrigger>
          <SelectValue placeholder="Select Subject" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((s) => (
            <SelectItem key={s._id} value={s._id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Chapter Filter */}
      <Select onValueChange={setSelectedChapter} value={selectedChapter}>
        <SelectTrigger>
          <SelectValue placeholder="Select Chapter" />
        </SelectTrigger>
        <SelectContent>
          {chapters.map((c) => (
            <SelectItem key={c._id} value={c._id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Difficulty Filter */}
      <Select onValueChange={setDifficulty} value={difficulty}>
        <SelectTrigger>
          <SelectValue placeholder="Select Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={startTest}>Start Test</Button>
    </div>
  );
}
