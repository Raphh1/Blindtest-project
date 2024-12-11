"use client";

import { signInWithGoogle } from "@/app/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";


export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    // La redirection se fera automatiquement via le useEffect quand user sera disponible
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-8">Connexion</h1>
      <Button onClick={handleGoogleLogin} className="mb-4">
        Se connecter avec Google
      </Button>
      <Link href="/signup" className="text-purple-400 underline">
        Pas de compte ? Inscris-toi
      </Link>
    </div>
  );
}
