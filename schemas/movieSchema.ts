import { z } from "zod";

export const movieInputSchema = z.object({
  title: z.string(),
  plot: z.string(),
  genres: z.array(z.string()),
  runtime: z.number(),
  cast: z.array(z.string()),
  poster: z.string(),
  fullplot: z.string(),
  languages: z.array(z.string()),
  released: z.string().datetime(),
  directors: z.array(z.string()),
  rated: z.string(),
  awards: z.object({
    wins: z.number(),
    nominations: z.number(),
    text: z.string(),
  }).optional(),
  lastupdated: z.string().optional(),
  year: z.number(),
  imdb: z.object({
    rating: z.number(),
    votes: z.number(),
    id: z.number(),
  }),
  countries: z.array(z.string()),
  type: z.string(),
  tomatoes: z.object({
    viewer: z.object({
      rating: z.number(),
      numReviews: z.number(),
      meter: z.number(),
    }),
    fresh: z.number(),
    critic: z.object({
      rating: z.number(),
      numReviews: z.number(),
      meter: z.number(),
    }),
    rotten: z.number(),
    lastUpdated: z.string(),
  }),
  num_mflix_comments: z.number().optional(),
});

export type MovieInput = z.infer<typeof movieInputSchema>;

