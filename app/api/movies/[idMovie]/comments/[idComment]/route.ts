import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/utils/mongoose";
import { Comment } from "@/models/Comment";
import { commentInputSchema } from "@/schemas/commentSchema";
import { error, success } from "@/utils/responses";

/**
 * @swagger
 * /api/movies/{idMovie}/comments/{idComment}:
 *   get:
 *     summary: Get a specific comment for a movie
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         example: "573a1390f29313caabcd4323"
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         example: "5a9427648b0beebeb69579e7"
 *     responses:
 *       200:
 *         description: A specific comment
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               data:
 *                 name: "Mercedes Tyler"
 *                 email: "mercedes_tyler@fakegmail.com"
 *                 text: "Eius veritatis vero facilis quaerat fuga temporibus. Praesentium expedita sequi repellat id."
 *                 date: "2002-08-18T04:56:07.000Z"
 *       400:
 *         description: Invalid movie ID or comment ID
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               message: "Invalid movie ID or comment ID"
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Comment not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               message: "Internal Server Error"
 *
 *   put:
 *     summary: Update a specific comment for a movie
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         example: "573a1390f29313caabcd4323"
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         example: "5a9427648b0beebeb69579e7"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CommentInput"
 *           example:
 *             name: "Mercedes Tyler"
 *             email: "mercedes_tyler@fakegmail.com"
 *             text: "Updated comment text"
 *     responses:
 *       200:
 *         description: Comment updated
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               data:
 *                 name: "Mercedes Tyler"
 *                 email: "mercedes_tyler@fakegmail.com"
 *                 text: "Updated comment text"
 *                 date: "2002-08-18T04:56:07.000Z"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               message: "Invalid input"
 *       404:
 *         description: Comment not found for update
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Comment not found for update"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               message: "Internal Server Error"
 *
 *   delete:
 *     summary: Delete a specific comment for a movie
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         example: "573a1390f29313caabcd4323"
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         example: "5a9427648b0beebeb69579e7"
 *     responses:
 *       200:
 *         description: Comment deleted
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               message: "Comment deleted"
 *       400:
 *         description: Invalid movie ID or comment ID
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               message: "Invalid movie ID or comment ID"
 *       404:
 *         description: Comment not found for deletion
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Comment not found for deletion"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               message: "Internal Server Error"
 */

export async function GET(
    req: Request,
    context:  { params: Promise<{ idMovie: string; idComment: string }> }
  ): Promise<NextResponse> {
    const { idMovie, idComment } = await context.params;
  
    await connectToDatabase();
  
    if (!mongoose.Types.ObjectId.isValid(idMovie) || !mongoose.Types.ObjectId.isValid(idComment)) {
      return error("Invalid movie ID or comment ID", 400);
    }
  
    const comment = await Comment.findOne({ _id: idComment, movie_id: idMovie }).lean();
    if (!comment) {
      return error("Comment not found", 404);
    }
  
    return success({ data: comment });
  }

export async function PUT(
    req: Request,
     params : { params: Promise<{ idMovie: string; idComment: string }> }
): Promise<NextResponse> {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid((await params.params).idMovie) || !mongoose.Types.ObjectId.isValid((await params.params).idComment)) {
            return error("Invalid movie ID or comment ID", 400);
        }

        const body = await req.json();
        const result = commentInputSchema.safeParse(body);
        if (!result.success) {
            return error("Invalid input", 400);
        }

        const updatedComment = await Comment.findOneAndUpdate(
            { _id: (await params.params).idComment, movie_id: (await params.params).idMovie },
            { $set: result.data },
            { new: true }
        );

        if (!updatedComment) {
            return error("Comment not found for update", 404);
        }

        return success({ data: updatedComment });
    } catch (err: any) {
        return error("Internal Server Error", 500, err.message);
    }
}

export async function DELETE(
    _req: Request,
    { params } : { params: Promise<{ idMovie: string; idComment: string }> }
): Promise<NextResponse> {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid((await params).idMovie) || !mongoose.Types.ObjectId.isValid((await params).idComment)) {
            return error("Invalid movie ID or comment ID", 400);
        }

        const deletedComment = await Comment.findOneAndDelete({ _id: (await params).idComment, movie_id: (await params).idMovie });

        if (!deletedComment) {
            return error("Comment not found for deletion", 404);
        }

        return success({ message: "Comment deleted" });
    } catch (err: any) {
        return error("Internal Server Error", 500, err.message);
    }
}