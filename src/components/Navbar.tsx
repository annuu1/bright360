"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">RBAC App</Link>
      <div className="space-x-4">
        {!session ? (
          <>
            <Link href="/login" className="text-blue-600">Login</Link>
            <Link href="/signup" className="text-blue-600">Signup</Link>
          </>
        ) : (
          <>
            {session.user?.role === "admin" && (
              <Link href="/admin" className="text-green-600">Admin</Link>
            )}
            {session.user?.role === "student" && (
              <Link href="/student" className="text-purple-600">Student</Link>
            )}
            <button onClick={() => signOut()} className="text-red-500">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
