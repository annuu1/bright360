import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export default function TestLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Student Test Portal</h1>
        <div className="text-sm">Good luck! 🚀</div>
      </header>

      {/* Main Test Area */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl p-6 shadow-xl">
          {children}
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center text-sm py-3">
        © {new Date().getFullYear()} EduTest | All rights reserved
      </footer>
    </div>
  );
}
