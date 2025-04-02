import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/utils/mongoose";
import { Comment } from "@/models/Comment";
import { commentInputSchema } from "@/schemas/commentSchema";
import { error, success } from "@/utils/responses";

/**
 * @swagger
 * /api/movies/{idMovie}/comments:
 *   get:
 *     summary: Get comments for a movie
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               data:
 *                 - name: "Jean Dupont"
 *                   email: "jean.dupont@example.com"
 *                   text: "Super film !"
 *                   date: "2025-03-31T12:00:00Z"
 *       400:
 *         description: Invalid movie ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 400
 *               message: "Invalid movie ID"
 *               error: null
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
 *   post:
 *     summary: Add a comment for a movie
 *     tags: [Comments]
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
 *             $ref: "#/components/schemas/CommentInput"
 *     responses:
 *       201:
 *         description: Comment added
 *         content:
 *           application/json:
 *             example:
 *               status: 201
 *               message: "Comment added"
 *               data:
 *                 name: "Jean Dupont"
 *                 email: "jean.dupont@example.com"
 *                 text: "Super film !"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 400
 *               message: "Invalid input"
 *               error:
 *                 - path: ["name"]
 *                   message: "Required"
 *                   code: "invalid_type"
 *                   expected: "string"
 *                   received: "undefined"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: 500
 *               message: "Internal Server Error"
 *               error: "Database connection failed"
*/

export async function GET(
    _req: Request,
    { params } : { params: Promise<{ idMovie: string}> }
): Promise<NextResponse> {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid((await params).idMovie)) {
            return error("Invalid movie ID", 400);
        }

        const comments = await Comment.find({ movie_id: (await params).idMovie }).lean();
        return success({ data: comments });
    } catch (err: any) {
        return error("Internal Server Error", 500, err.message);
    }
}

export async function POST(
    req: Request,
    { params } : { params: Promise<{ idMovie: string}> }
): Promise<NextResponse> {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid((await params).idMovie)) {
            return error("Invalid movie ID", 400);
        }

        const body = await req.json();
        const result = commentInputSchema.safeParse(body);
        if (!result.success) {
            return error("Invalid input", 400, result.error.issues);
        }

        const newComment = await Comment.create({
            ...result.data,
            movie_id: (await params).idMovie,
        });

        return success({ message: "Comment added", data: newComment }, 201);
    } catch (err: any) {
        return error("Internal Server Error", 500, err.message);
    }
}
