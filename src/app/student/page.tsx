"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, ClipboardList, BarChart } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  return (
    <main className="p-4 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Student Dashboard</h1>
        <Link href="/profile">
          <Button variant="outline">Profile</Button>
        </Link>
      </header>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/student/subjects">
          <Card className="cursor-pointer">
            <CardHeader>
              <Book className="w-6 h-6 mb-2" />
              <CardTitle>My Subjects</CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/student/tests">
          <Card className="cursor-pointer">
            <CardHeader>
              <ClipboardList className="w-6 h-6 mb-2" />
              <CardTitle>Take a Test</CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/student/progress">
          <Card className="cursor-pointer">
            <CardHeader>
              <BarChart className="w-6 h-6 mb-2" />
              <CardTitle>My Progress</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </section>
    </main>
  );
}
