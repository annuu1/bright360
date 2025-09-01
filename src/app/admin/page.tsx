"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, BookOpen, FileText, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="p-4 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <Link href="/profile" className="text-sm text-gray-500">Profile</Link>
      </header>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Link href="/admin/upload">
          <Card className="cursor-pointer">
            <CardHeader>
              <Upload className="w-6 h-6 mb-2" />
              <CardTitle>Upload Question Bank</CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/classes">
          <Card className="cursor-pointer">
            <CardHeader>
              <BookOpen className="w-6 h-6 mb-2" />
              <CardTitle>Manage Subjects</CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/chapters">
          <Card className="cursor-pointer">
            <CardHeader>
              <FileText className="w-6 h-6 mb-2" />
              <CardTitle>Manage Chapters</CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/reports">
          <Card className="cursor-pointer">
            <CardHeader>
              <BarChart2 className="w-6 h-6 mb-2" />
              <CardTitle>Reports</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </section>
    </main>
  );
}
