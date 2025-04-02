import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/utils/mongoose";
import { Theater } from "@/models/Theater";
import { error, success } from "@/utils/responses";
import { theaterInputSchema } from "@/schemas/theaterSchema";

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   get:
 *     summary: Get a theater by ID
 *     tags: [Theaters]
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         example: "605c72ef2f1b2c0015b2c123"
 *     responses:
 *       200:
 *         description: Theater retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               data:
 *                 theaterId: 1
 *                 location:
 *                   address:
 *                     street1: "123 Rue des Lilas"
 *                     city: "Paris"
 *                     state: "Île-de-France"
 *                     zipcode: "75000"
 *                   geo:
 *                     type: "Point"
 *                     coordinates: [2.3522, 48.8566]
 *       400:
 *         description: Invalid theater ID
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               message: "Invalid theater ID"
 *       404:
 *         description: Theater not found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Theater not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               message: "Internal Server Error"
 *
 *   put:
 *     summary: Update a theater by ID
 *     tags: [Theaters]
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         example: "605c72ef2f1b2c0015b2c123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TheaterInput'
 *           example:
 *             location:
 *               address:
 *                 street1: "456 Avenue du Théâtre"
 *                 city: "Lyon"
 *                 state: "Auvergne-Rhône-Alpes"
 *                 zipcode: "69000"
 *               geo:
 *                 type: "Point"
 *                 coordinates: [4.8357, 45.7640]
 *     responses:
 *       200:
 *         description: Theater updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               data:
 *                 theaterId: 1
 *                 location:
 *                   address:
 *                     street1: "456 Avenue du Théâtre"
 *                     city: "Lyon"
 *                     state: "Auvergne-Rhône-Alpes"
 *                     zipcode: "69000"
 *                   geo:
 *                     type: "Point"
 *                     coordinates: [4.8357, 45.7640]
 *       400:
 *         description: Invalid input or theater ID
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               message: "Invalid input"
 *       404:
 *         description: Theater not found for update
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Theater not found for update"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               message: "Internal Server Error"
 *
 *   delete:
 *     summary: Delete a theater by ID
 *     tags: [Theaters]
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         example: "605c72ef2f1b2c0015b2c123"
 *     responses:
 *       200:
 *         description: Theater deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               message: "Theater deleted"
 *       400:
 *         description: Invalid theater ID
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               message: "Invalid theater ID"
 *       404:
 *         description: Theater not found for deletion
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               message: "Theater not found for deletion"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               message: "Internal Server Error"
 */
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ idTheater: string}> }
): Promise<NextResponse> {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid((await params).idTheater)) {
            return error("Invalid theater ID", 400);
        }

        const theater = await Theater.findById((await params).idTheater).lean();

        if (!theater) {
            return error("Theater not found", 404);
        }

        return success({ data: theater });
    } catch (err: any) {
        return error("Internal Server Error", 500, err.message);
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ idTheater: string}> }
): Promise<NextResponse> {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid((await params).idTheater)) {
            return error("Invalid theater ID", 400);
        }

        const body = await req.json();
        const result = theaterInputSchema.safeParse(body);
        if (!result.success) {
            return error("Invalid input", 400, result.error.issues);
        }

        const updatedTheater = await Theater.findByIdAndUpdate(
            (await params).idTheater,
            { $set: result.data },
            { new: true }
        );

        if (!updatedTheater) {
            return error("Theater not found for update", 404);
        }

        return success({
            message: "Theater updated",
            data: updatedTheater
        });
    } catch (err: any) {
        return error("Internal Server Error", 500, err.message);
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ idTheater: string}> }
): Promise<NextResponse> {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid((await params).idTheater)) {
            return error("Invalid theater ID", 400);
        }

        const deletedTheater = await Theater.findByIdAndDelete((await params).idTheater);

        if (!deletedTheater) {
            return error("Theater not found for deletion", 404);
        }

        return success({ message: "Theater deleted" });
    } catch (err: any) {
        return error("Internal Server Error", 500, err.message);
    }
}
