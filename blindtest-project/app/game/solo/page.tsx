"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { PlayerForm } from "@/components/PlayerForm";
import { GenreSelector } from "@/components/GenreSelector";
import { useSoloGame } from "@/app/hooks/useSoloGame";
import { useForm } from "react-hook-form";

export default function SoloPage() {
  const { user } = useAuth();
  const form = useForm({
    defaultValues: {
      player2: "",
      player3: "",
      player4: "",
    },
  });

  const { selectedGenre, handleGenreSelect, handleSubmit } = useSoloGame(user);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-zinc-900 border-violet-500/20">
          <CardHeader>
            <CardTitle className="text-violet-300">Mode Solo</CardTitle>
            <CardDescription className="text-zinc-400">
              Configurez votre partie solo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <Card className="bg-zinc-800 border-violet-500/20">
                  <CardHeader>
                    <CardTitle className="text-violet-300 text-lg">
                      Pseudos des joueurs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PlayerForm user={user} form={form} />
                  </CardContent>
                </Card>

                <GenreSelector 
                  selectedGenre={selectedGenre} 
                  onGenreSelect={handleGenreSelect} 
                />

              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}