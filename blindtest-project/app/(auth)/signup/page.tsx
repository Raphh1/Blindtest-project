// app/(auth)/signup/page.tsx
"use client";

import {  useEffect } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInWithGoogle } from "@/app/lib/firebase/auth";

export default function SignupPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Utilise useEffect pour rediriger après le rendu
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleGoogleSignup = async () => {
    await signInWithGoogle();
    // Une fois connecté, le useEffect va se déclencher et rediriger
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-8">Inscription</h1>
      <Button onClick={handleGoogleSignup} className="mb-4">
        S&apos;inscrire avec Google
      </Button>
      <Link href="/login" className="text-purple-400 underline mb-4">
        Déjà un compte ? Connecte-toi
      </Link>
      {user && (
        <div className="flex flex-col items-center">
          <img src={user.photoURL || "/default-profile.png"} alt="Photo de profil" className="w-24 h-24 rounded-full mb-4" />
          <p className="text-white">{user.displayName || "Utilisateur"}</p>
        </div>
      )}
    </div>
  );
}