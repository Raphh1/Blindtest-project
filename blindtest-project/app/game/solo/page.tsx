"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { PlayerForm } from "@/components/PlayerForm";
import { GenreSelector } from "@/components/GenreSelector";
import { useSoloGame } from "@/app/hooks/useSoloGame";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SoloPage() {
  const { user } = useAuth();
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      player2: "",
      player3: "",
      player4: "",
    },
  });

  const { selectedGenre, handleGenreSelect, handleSubmit } = useSoloGame(user);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-zinc-400 hover:text-violet-500 hover:bg-violet-200/10 gap-2 transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            Retour
          </Button>
        </div>

        <Card className="bg-zinc-900 border-violet-500/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
              Mode Solo
            </CardTitle>
            <CardDescription className="text-zinc-400 text-lg">
              Configurez votre partie solo
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Card className="bg-zinc-800/50 border-violet-500/20">
                    <CardHeader>
                      <CardTitle className="text-violet-300 text-xl">
                        Pseudos des joueurs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PlayerForm user={user} form={form} />
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800/50 border-violet-500/20">
                    <CardHeader>
                      <CardTitle className="text-violet-300 text-xl">
                        Genre musical
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <GenreSelector 
                        selectedGenre={selectedGenre} 
                        onGenreSelect={handleGenreSelect} 
                      />
                    </CardContent>
                  </Card>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
