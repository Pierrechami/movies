import { z } from "zod";

export const userInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email("Email invalide"),
  password: z.string().min(9),
});

export type userShema = z.infer<typeof userInputSchema>;