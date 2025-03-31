import { z } from "zod";

export const commentInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  text: z.string().min(1),
});

export type CommentInput = z.infer<typeof commentInputSchema>;
