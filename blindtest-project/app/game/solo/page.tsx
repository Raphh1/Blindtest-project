"use client";

import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  player2: z.string().min(2, "Le pseudo doit contenir au moins 2 caractères"),
  player3: z.string().min(2, "Le pseudo doit contenir au moins 2 caractères"),
  player4: z.string().min(2, "Le pseudo doit contenir au moins 2 caractères"),
});

type FormData = z.infer<typeof formSchema>;

export default function SoloPage() {
  const { user } = useAuth();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      player2: "",
      player3: "",
      player4: "",
    },
  });
  const [selectedGenre, setSelectedGenre] = useState("");

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
  };

  const onSubmit = (data: FormData) => {
    // Combine user data with form data
    const allPlayers = {
      player1: user?.displayName || "",
      ...data
    };
    console.log(allPlayers);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-zinc-900 border-violet-500/20 hover:border-violet-500/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-violet-300">Mode Solo</CardTitle>
            <CardDescription className="text-zinc-400">
              Configurez votre partie solo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Section des pseudos */}
                <Card className="bg-zinc-800 border-violet-500/20">
                  <CardHeader>
                    <CardTitle className="text-violet-300 text-lg">Pseudos des joueurs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Joueur connecté (non modifiable) */}
                    <div className="space-y-2">
                      <FormLabel className="text-zinc-300">Joueur 1 (Vous)</FormLabel>
                      <Input 
                        value={user?.displayName || ""}
                        disabled
                        className="bg-zinc-700 border-violet-500/20 opacity-50 text-white"
                      />
                    </div>

                    {/* Autres joueurs */}
                    <FormField
                      control={form.control}
                      name="player2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Joueur 2</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-zinc-700 border-violet-500/20 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="player3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Joueur 3</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-zinc-700 border-violet-500/20 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="player4"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Joueur 4</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-zinc-700 border-violet-500/20 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Section des genres musicaux - reste inchangée */}
                <Card className="bg-zinc-800 border-violet-500/20">
                  <CardHeader>
                    <CardTitle className="text-violet-300 text-lg">Style musical</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        className={`${
                          selectedGenre === "rap"
                            ? "bg-violet-600"
                            : "bg-zinc-700 hover:bg-violet-600/50"
                        }`}
                        onClick={() => handleGenreSelect("rap")}
                      >
                        Rap
                      </Button>
                      <Button
                        type="button"
                        className={`${
                          selectedGenre === "rnb"
                            ? "bg-violet-600"
                            : "bg-zinc-700 hover:bg-violet-600/50"
                        }`}
                        onClick={() => handleGenreSelect("rnb")}
                      >
                        R&B
                      </Button>
                      <Button
                        type="button"
                        className={`${
                          selectedGenre === "pop"
                            ? "bg-violet-600"
                            : "bg-zinc-700 hover:bg-violet-600/50"
                        }`}
                        onClick={() => handleGenreSelect("pop")}
                      >
                        Pop
                      </Button>
                      <Button
                        type="button"
                        className={`${
                          selectedGenre === "jazz"
                            ? "bg-violet-600"
                            : "bg-zinc-700 hover:bg-violet-600/50"
                        }`}
                        onClick={() => handleGenreSelect("jazz")}
                      >
                        Jazz
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  Commencer le jeu
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}