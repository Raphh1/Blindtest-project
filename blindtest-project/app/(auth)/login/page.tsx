"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithGoogle } from "@/app/lib/firebase/auth";
import { FcGoogle } from 'react-icons/fc';

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
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-800/50 border-violet-500/20">
        <CardHeader className="space-y-6 text-center pb-8">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
              Bienvenue sur BlindGame
            </CardTitle>
            <CardDescription className="text-zinc-400 text-lg">
              Connectez-vous pour commencer à jouer
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Button 
            onClick={handleGoogleLogin} 
            variant="outline"
            size="lg"
            className="w-full py-6 text-lg bg-zinc-700/50 border-violet-500/20 hover:bg-violet-600/20 hover:border-violet-500/40 transition-all duration-300 group text-white hover:text-white"
          >
            <FcGoogle className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform " />
            Continuer avec Google
          </Button>
          
          <div className="text-center">
            <Link 
              href="/signup" 
              className="text-violet-400 hover:text-violet-300 transition-colors text-sm"
            >
              Pas encore de compte ? Inscrivez-vous
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}