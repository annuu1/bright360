"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Edit } from "lucide-react";

interface Question {
  _id: string;
  text: string;
  options: { text: string }[];
  correctOptionIndex: number;
  subject?: { _id: string; name: string };
  chapter?: { _id: string; name: string };
  difficulty: string;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ class: "", subject: "", chapter: "", difficulty: "" });

  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [difficulty, setDifficulty] = useState("medium");

  // Fetch questions with filters + pagination
  useEffect(() => {
    fetchQuestions();
  }, [page, filters]);

  const fetchQuestions = async () => {
    const params = new URLSearchParams({ page: page.toString(), ...filters });
    const res = await fetch(`/api/admin/questions?${params}`);
    const data = await res.json();
    setQuestions(data.questions ?? []);
    setTotal(data.total ?? 0);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, options, correctOptionIndex, difficulty }),
    });
    if (res.ok) {
      setText("");
      setOptions(["", ""]);
      fetchQuestions();
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    fetchQuestions();
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Questions</h1>

      {/* Add Question Form */}
      <form onSubmit={handleAdd} className="space-y-3 border p-4 rounded-md">
        <label className="block font-medium">Question</label>
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter question text" />

        {options.map((opt, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              value={opt}
              onChange={(e) => {
                const newOpts = [...options];
                newOpts[i] = e.target.value;
                setOptions(newOpts);
              }}
              placeholder={`Option ${i + 1}`}
            />
            <input
              type="radio"
              name="correctOption"
              checked={correctOptionIndex === i}
              onChange={() => setCorrectOptionIndex(i)}
            />
          </div>
        ))}

        <Button type="button" onClick={() => setOptions([...options, ""])}>+ Add Option</Button>

        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" /> Add Question</Button>
      </form>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Filter by class"
          value={filters.class}
          onChange={(e) => setFilters({ ...filters, class: e.target.value })}
        />
        <Input
          placeholder="Filter by subject"
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
        />
        <Input
          placeholder="Filter by chapter"
          value={filters.chapter}
          onChange={(e) => setFilters({ ...filters, chapter: e.target.value })}
        />
        <Select value={filters.class} onValueChange={(v) => setFilters(f => ({ ...f, class: v === "all" ? "" : v }))}>
  <SelectTrigger>
    <SelectValue placeholder="Select class" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Classes</SelectItem>
    <SelectItem value="8">Class 8</SelectItem>
    <SelectItem value="9">Class 9</SelectItem>
    <SelectItem value="10">Class 10</SelectItem>
  </SelectContent>
</Select>

      </div>

      {/* Questions Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Options</TableHead>
            <TableHead>Correct</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Chapter</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((q) => (
            <TableRow key={q._id}>
              <TableCell>{q.text}</TableCell>
              <TableCell>{q.options.map((o, i) => <div key={i}>{o.text}</div>)}</TableCell>
              <TableCell>{q.options[q.correctOptionIndex]?.text}</TableCell>
              <TableCell>{q.difficulty}</TableCell>
              <TableCell>{q.subject?.name}</TableCell>
              <TableCell>{q.chapter?.name}</TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => handleDelete(q._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost">
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
        <span>
          Page {page} of {Math.ceil(total / 10)}
        </span>
        <Button disabled={page * 10 >= total} onClick={() => setPage(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
