"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

interface Subject {
  _id: string;
  name: string;
}

interface Chapter {
  _id: string;
  name: string;
  order: number;
  subject: Subject;
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch chapters and subjects
  useEffect(() => {
    fetchChapters();
    fetchSubjects();
  }, []);

  const fetchChapters = async () => {
    const res = await fetch("/api/admin/chapters");
    const data = await res.json();
    setChapters(data.chapters ?? []);
  };

  const fetchSubjects = async () => {
    const res = await fetch("/api/admin/subjects");
    const data = await res.json();
    setSubjects(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        subjectId,
        order: order ? Number(order) : 0,
      }),
    });

    if (res.ok) {
      setName("");
      setSubjectId("");
      setOrder("");
      fetchChapters();
    }

    setLoading(false);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Chapters</h1>

      {/* Add Chapter Form */}
      <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter chapter name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <Select value={subjectId} onValueChange={setSubjectId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject._id} value={subject._id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Order</label>
          <Input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="0"
          />
        </div>

        <Button type="submit" disabled={loading}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {loading ? "Adding..." : "Add"}
        </Button>
      </form>

      {/* Chapters Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chapters.map((chapter) => (
            <TableRow key={chapter._id}>
              <TableCell>{chapter._id}</TableCell>
              <TableCell>{chapter.order}</TableCell>
              <TableCell>{chapter.name}</TableCell>
              <TableCell>{chapter.subject?.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
