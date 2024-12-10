// components/ui/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";
import { logout } from "@/app/lib/firebase/auth";

export function Navbar() {
  const { user, loading } = useAuth();

  return (
    <nav className="w-full flex items-center justify-between p-4 bg-zinc-900 text-zinc-200">
      <div className="text-xl font-semibold">
        <Link href="/">Blindtest</Link>
      </div>
      <div>
        {loading ? (
          <span>Chargement...</span>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span>Bienvenue, {user.displayName || user.email}</span>
            <button
              onClick={logout}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
          >
            Se connecter
          </Link>
        )}
      </div>
    </nav>
  );
}
