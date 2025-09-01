"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

interface Subject {
  _id: string;
  name: string;
  class: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch subjects
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const res = await fetch("/api/admin/subjects");
    const data = await res.json();
    setSubjects(data);
  };

  // Add subject
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, class: className }),
    });

    if (res.ok) {
      setName("");
      setClassName("");
      fetchSubjects();
    }

    setLoading(false);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Subjects</h1>

      {/* Add Subject Form */}
      <form onSubmit={handleSubmit} className="flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter subject name" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
          <Input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Enter class" />
        </div>

        <Button type="submit" disabled={loading}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {loading ? "Adding..." : "Add"}
        </Button>
      </form>

      {/* Subjects Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Class</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects?.map((subject) => (
            <TableRow key={subject._id}>
              <TableCell>{subject.name}</TableCell>
              <TableCell>{subject.class}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
