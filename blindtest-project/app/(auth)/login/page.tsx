"use client";

import { signInWithGoogle } from "@/app/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";



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
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-96 bg-zinc-900 border-violet-500/20 hover:border-violet-500/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-violet-300 flex items-center gap-2 ml-24">Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGoogleLogin} className="mb-4">
            Se connecter avec Google
          </Button>
          <CardDescription>
            <Link href="/signup" className="text-purple-400 underline">
              Pas de compte ? Inscris-toi
            </Link>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
