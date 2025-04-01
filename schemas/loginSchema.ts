import { z } from "zod";

export const loginInputSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Mot de passe requis"),
  });

export type userInput = z.infer<typeof loginInputSchema>;