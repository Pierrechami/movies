import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/utils/mongoose";
import { movieInputSchema } from "@/schemas/movieSchema";
import { success, error } from "@/utils/responses";
import { Movie } from "@/models/Movie";
import { MovieType } from "@/types/movie";

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Movie found
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               data:
 *                 _id: "573a1390f29313caabcd42e8"
 *                 title: "The Great Train Robbery"
 *                 year: 1903
 *                 genres: ["Short", "Western"]
 *                 rated: "TV-G"
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Movie not found"
 *               error: "Aucun film trouvé avec cet ID"
 *
 *   put:
 *     summary: Update a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               message: "Movie updated"
 *               data:
 *                 title: "Updated Movie Title"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               message: "Invalid input"
 *               error: [...]
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Movie not found"
 *               error: "ID not found"
 *
 *   delete:
 *     summary: Delete a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               message: "Movie deleted"
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Movie not found"
 *               error: "ID not found"
 */

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ idMovie: string}> }
  ): Promise<NextResponse> {
    try {
      await connectToDatabase();
  
      if (!mongoose.Types.ObjectId.isValid((await params).idMovie)) {
        return error("Invalid movie ID", 400);
      }

      const movie = await Movie.findById((await params).idMovie).lean() as MovieType | null;
  
      if (!movie) {
        return error("Movie not found", 404);
      }
  
      const formattedMovie = {
        ...movie,
        _id: movie._id.toString(),
      };
  
      return success({ data: formattedMovie });
    } catch (err: any) {
      return error("Internal Server Error", 500, err.message);
    }
  }

  export async function PUT(
    req: Request,
    { params }: { params: Promise<{ idMovie: string}> }
  ): Promise<NextResponse> {
    try {
      await connectToDatabase();
  
      if (!mongoose.Types.ObjectId.isValid((await params).idMovie)) {
        return error("Invalid movie ID", 400);
      }
  
      const body = await req.json();
      const result = movieInputSchema.safeParse(body);
      if (!result.success) {
        return error("Invalid input", 400, result.error.issues);
      }
  
      const updatedMovie = await Movie.findByIdAndUpdate(
        (await params).idMovie,
        result.data,
        { new: true, lean: true }
      ) as MovieType | null;
  
      if (!updatedMovie) {
        return error("Movie not found", 404);
      }
  
      const formattedMovie = {
        ...updatedMovie,
        _id: updatedMovie._id.toString(),
      };
  
      return success({
        message: "Movie updated",
        data: formattedMovie,
      });
    } catch (err: any) {
      return error("Internal Server Error", 500, err.message);
    }
  }

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ idMovie: string}> }
): Promise<NextResponse> {
  try {
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid((await params).idMovie)) {
      return error("Invalid movie ID", 400);
    }

    const deleted = await Movie.findByIdAndDelete((await params).idMovie);

    if (!deleted) {
      return error("Movie not found", 404, "ID not found");
    }

    return success({ message: "Movie deleted" });
  } catch (err: any) {
    return error("Internal Server Error", 500, err.message);
  }
}
