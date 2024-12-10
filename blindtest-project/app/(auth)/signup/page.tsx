// app/(auth)/signup/page.tsx
"use client";

import { signInWithGoogle } from "@/app/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/app/components/ui/Button";


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
        S'inscrire avec Google
      </Button>
      <Link href="/login" className="text-purple-400 underline">
        Déjà un compte ? Connecte-toi
      </Link>
    </div>
  );
}
