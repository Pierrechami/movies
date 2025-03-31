import { z } from "zod";

export const theaterInputSchema = z.object({
    location: z.object({
        address: z.object({
            street1: z.string(),
            city: z.string(),
            state: z.string(),
            zipcode: z.string(),
        }),
        geo: z.object({
            type: z.enum(["Point"]),
            coordinates: z.array(z.number()).length(2),
        }),
    }),
});

export type heaterInput = z.infer<typeof theaterInputSchema>;