import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/mongoose";
import { movieInputSchema } from "@/schemas/movieSchema";
import { Movie } from "@/models/Movie";
import { success, error } from "@/utils/responses";

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get a list of movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Successfully retrieved movies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MoviesResponse'
 *             example:
 *               status: 200
 *               data:
 *                 - _id: "6607e93ab6c8ab96f0134abc"
 *                   title: "Inception"
 *                   year: 2010
 *                   genres: ["Action", "Sci-Fi"]
 *                   runtime: 148
 *                   rated: "PG-13"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 500
 *               message: "Internal Server Error"
 *               error: "MongoDB connection error"
 */
export async function GET(): Promise<NextResponse> {
    try {
      await connectToDatabase();
      
      const movies = await Movie.find().limit(1);

      return success({ data: movies });
    } catch (err: any) {
      return error("Internal Server Error", 500, err.message);
    }
  }
  

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *           example:
 *             title: "Inception"
 *             plot: "A thief who steals corporate secrets through dream-sharing technology..."
 *             genres: ["Action", "Sci-Fi", "Thriller"]
 *             runtime: 148
 *             cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"]
 *             poster: "https://example.com/inception.jpg"
 *             fullplot: "Dom Cobb is a skilled thief..."
 *             languages: ["English"]
 *             released: "2010-07-16T00:00:00.000Z"
 *             directors: ["Christopher Nolan"]
 *             rated: "PG-13"
 *             awards:
 *               wins: 4
 *               nominations: 8
 *               text: "Won 4 Oscars. Another 152 wins & 218 nominations."
 *             lastupdated: "2025-03-30T12:00:00Z"
 *             year: 2010
 *             imdb:
 *               rating: 8.8
 *               votes: 2000000
 *               id: 1375666
 *             countries: ["USA", "UK"]
 *             type: "movie"
 *             tomatoes:
 *               viewer:
 *                 rating: 4.5
 *                 numReviews: 3500
 *                 meter: 90
 *               fresh: 300
 *               critic:
 *                 rating: 8.1
 *                 numReviews: 290
 *                 meter: 87
 *               rotten: 10
 *               lastUpdated: "2025-03-29T22:00:00Z"
 *             num_mflix_comments: 0
 *     responses:
 *       201:
 *         description: Movie successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Movie created
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *             example:
 *               status: 201
 *               message: Movie created
 *               data:
 *                 _id: "6607e93ab6c8ab96f0134abc"
 *                 title: "Inception"
 *                 year: 2010
 *                 rated: "PG-13"
 *                 genres: ["Action", "Sci-Fi"]
 *       400:
 *         description: Invalid input (missing or malformed fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 400
 *               message: "Invalid input"
 *               error:
 *                 - path: ["title"]
 *                   message: "Required"
 *                   code: "invalid_type"
 *                   expected: "string"
 *                   received: "undefined"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 500
 *               message: "Internal Server Error"
 *               error: "MongoDB connection error"
 */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();

    const result = movieInputSchema.safeParse(body);
    if (!result.success) {
      return error("Invalid input", 400, result.error.issues);
    }

    await connectToDatabase();
    const newMovie = await Movie.create(result.data);

    return success(
      {
        message: "Movie created",
        data: newMovie,
      },
      201
    );
  } catch (err: any) {
    return error("Internal Server Error", 500, err.message);
  }
}