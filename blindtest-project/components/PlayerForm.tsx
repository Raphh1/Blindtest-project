import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { User } from "firebase/auth";
import { UseFormReturn } from "react-hook-form";

type PlayerFormData = {
  player2: string;
  player3: string;
  player4: string;
}

export function PlayerForm({ user, form }: { user: User | null, form: UseFormReturn<PlayerFormData> }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FormLabel className="text-zinc-300">Joueur 1 (Vous)</FormLabel>
        <Input 
          value={user?.displayName || ""}
          disabled
          className="bg-zinc-700 border-violet-500/20 opacity-50 text-white"
        />
      </div>

      {["player2", "player3", "player4"].map((fieldName, index) => (
        <FormField
          key={fieldName}
          control={form.control}
          name={fieldName as keyof PlayerFormData}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-300">Joueur {index + 2}</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  className="bg-zinc-700 border-violet-500/20 text-white"
                  placeholder={`Pseudo joueur ${index + 2} (optionnel)`}
                />
              </FormControl>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}