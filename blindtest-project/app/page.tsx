// app/page.tsx
"use client";

import Link from "next/link";
import { useAuth } from "./providers/AuthProvider";
import { logout } from "./lib/firebase/auth";
import { Button } from "./components/ui/Button";
import { Navbar } from "./components/ui/Navbar";


export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Chargement...</div>;
  }


  return (
    <div className="">
        <Navbar>
        </Navbar>
      {user ? (
        <>
          <h1 className="flex flex-col items-center justify-center h-screen">Pret à jouer ?  {user.displayName || user.email}</h1>
        </>
      ) : (
        <>
          <h1 className="text-3xl mb-4">Bienvenue sur le Blindtest</h1>
          <Link href="/login">
            <Button>Se connecter</Button>
          </Link>
        </>
      )}
    </div>
  );
}