// src/app/student/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Subject {
  _id: string;
  name: string;
  class: string;
  chapters: { _id: string; name: string }[];
}

interface Student {
  _id: string;
  name: string;
  class: string;
  subjects: Subject[];
  completedChapters: { subject: Subject; chapter: { _id: string; name: string } }[];
  stats: {
    testsTaken: number;
    averageScore: number;
    totalCorrectAnswers: number;
    totalQuestionsAttempted: number;
  };
}

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [completedChapters, setCompletedChapters] = useState<{ subject: string; chapter: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchSubjects();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch("/api/student/profile");
    const data = await res.json();
    if (data.student) {
      setStudent(data.student);
      setName(data.student.name);
      setStudentClass(data.student.class);
      setSelectedSubjects(data.student.subjects.map((s: Subject) => s._id));
      setCompletedChapters(
        data.student.completedChapters.map((c: any) => ({
          subject: c.subject._id,
          chapter: c.chapter._id,
        }))
      );
    }
  };

  const fetchSubjects = async () => {
    const res = await fetch("/api/admin/subjects");
    const data = await res.json();
    setAllSubjects(data);
  };

  const handleToggleChapter = (subjectId: string, chapterId: string) => {
    const exists = completedChapters.find((c) => c.subject === subjectId && c.chapter === chapterId);
    if (exists) {
      setCompletedChapters(completedChapters.filter((c) => !(c.subject === subjectId && c.chapter === chapterId)));
    } else {
      setCompletedChapters([...completedChapters, { subject: subjectId, chapter: chapterId }]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await fetch("/api/student/profile", {
      method: student ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        class: studentClass,
        subjects: selectedSubjects,
        completedChapters,
      }),
    });
    if (res.ok) fetchProfile();
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Student Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>Class</Label>
            <Select value={studentClass} onValueChange={setStudentClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">Class 8</SelectItem>
                <SelectItem value="9">Class 9</SelectItem>
                <SelectItem value="10">Class 10</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
  <Label>Subjects</Label>
  <div className="space-y-2">
    {allSubjects
      .filter((s) => s.class === studentClass)
      .map((s) => (
        <div key={s._id} className="border rounded p-2">
          {/* Subject checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedSubjects.includes(s._id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedSubjects([...selectedSubjects, s._id]);
                } else {
                  setSelectedSubjects(selectedSubjects.filter((id) => id !== s._id));
                  // also remove completed chapters of that subject
                  setCompletedChapters(
                    completedChapters.filter((cc) => cc.subject !== s._id)
                  );
                }
              }}
            />
            <span className="font-medium">{s.name}</span>
          </div>

          {/* Chapters (only if subject is selected) */}
          {selectedSubjects.includes(s._id) && s.chapters.length > 0 && (
            <div className="ml-6 mt-2 space-y-1">
              {s.chapters.map((c) => {
                const isChecked = completedChapters.some(
                  (cc) => cc.subject === s._id && cc.chapter === c._id
                );

                return (
                  <div key={c._id} className="flex items-center gap-2">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCompletedChapters([
                            ...completedChapters,
                            { subject: s._id, chapter: c._id },
                          ]);
                        } else {
                          setCompletedChapters(
                            completedChapters.filter(
                              (cc) => !(cc.subject === s._id && cc.chapter === c._id)
                            )
                          );
                        }
                      }}
                    />
                    <span>{c.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
  </div>
</div>


          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </CardContent>
      </Card>

      {student && (
        <Card>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Tests Taken: {student.stats.testsTaken}</p>
            <p>Average Score: {student.stats.averageScore}%</p>
            <p>Total Correct Answers: {student.stats.totalCorrectAnswers}</p>
            <p>Total Attempted: {student.stats.totalQuestionsAttempted}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
