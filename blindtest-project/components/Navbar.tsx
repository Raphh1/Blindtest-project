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
      <div className="flex-1 text-center pr-8"> 
        {loading ? (
          <span>Chargement...</span>
        ) : user ? (
          <span className="pl-24">Bienvenue, {user.displayName || user.email}</span>
        ) : (
          <Link href="/login" className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1 rounded">
            Se connecter
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Link href="/profile" className="text-zinc-400 hover:text-white transition-colors">
              Profil
            </Link>
            <button 
              onClick={handleLogout}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </nav>
  );
}