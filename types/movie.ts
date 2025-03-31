import { Types } from "mongoose";
import { InferSchemaType } from "mongoose";
import { movieSchema } from "@/models/Movie";

type MovieBase = InferSchemaType<typeof movieSchema>;
export type MovieType = MovieBase & { _id: Types.ObjectId };
