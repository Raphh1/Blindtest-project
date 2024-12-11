// components/ui/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";
import { logout } from "@/app/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="w-full flex items-center justify-between p-4 bg-zinc-900 text-zinc-200 border-b border-zinc-700">
      <div className="text-xl font-semibold">
        <Link href="/">Blindtest</Link>
      </div>
      <div className="flex-1 text-center">
        {loading ? (
          <span>Chargement...</span>
        ) : user ? (
          <span>Bienvenue, {user.displayName || user.email}</span>
        ) : (
          <Link href="/login" className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1 rounded">
            Se connecter
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
    <Link href="/profile">
              <img
                src={user.photoURL || "/default-profile.png"}
                alt="Photo de profil"
                className="rounded-full w-8 h-8 hover:ring-2 hover:ring-purple-600"
              />
            </Link>
            <button
              onClick={handleLogout}
              className="bg-transparent hover:bg-zinc-700 p-2 rounded-full"
            >
              <LogOut className="w-6 h-6 text-white" />
            </button>
          </>
        )}
      </div>
    </nav>
  );
}