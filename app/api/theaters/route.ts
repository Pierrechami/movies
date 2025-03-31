import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/mongoose";
import { theaterInputSchema } from "@/schemas/theaterSchema";
import { success, error } from "@/utils/responses";
import { Theater } from "@/models/Theater";

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     summary: Get all theaters
 *     tags: [Theaters]
 *     responses:
 *       200:
 *         description: List of all theaters
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               data:
 *                 - theaterId: 1
 *                   location:
 *                     address:
 *                       street1: "123 Rue des Lilas"
 *                       city: "Paris"
 *                       state: "Île-de-France"
 *                       zipcode: "75000"
 *                     geo:
 *                       type: "Point"
 *                       coordinates: [2.3522, 48.8566]
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
 *     summary: Add a new theater
 *     tags: [Theaters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             location:
 *               address:
 *                 street1: "123 Rue des Lilas"
 *                 city: "Paris"
 *                 state: "Île-de-France"
 *                 zipcode: "75000"
 *               geo:
 *                 type: "Point"
 *                 coordinates: [2.3522, 48.8566]
 *     responses:
 *       201:
 *         description: Theater added successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 201
 *               message: "Theater added"
 *               data:
 *                 theaterId: 2
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
 *         description: Invalid input
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               message: "Invalid input"
 *               error:
 *                 - path: ["location", "address", "street1"]
 *                   message: "Required"
 *                   code: "invalid_type"
 *                   expected: "string"
 *                   received: "undefined"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               message: "Internal Server Error"
 *               error: "MongoDB connection error"
 */
export async function GET(): Promise<NextResponse> {
    try {
      await connectToDatabase();
      const theaters = await Theater.find().lean();
      return success({ data: theaters });
    } catch (err: any) {
      return error("Internal Server Error", 500, err.message);
    }
  }
  export async function POST(req: Request): Promise<NextResponse> {
    try {
      await connectToDatabase();
      const body = await req.json();
  
      const result = theaterInputSchema.safeParse(body);
      if (!result.success) {
        return error("Invalid input", 400, result.error.issues);
      }
  
      const lastTheater = await Theater.findOne().sort({ theaterId: -1 });
      const newTheaterId = lastTheater ? lastTheater.theaterId + 1 : 1;
  
      const newTheater = await Theater.create({
        theaterId: newTheaterId,
        ...result.data,
      });
  
      return success({ message: "Theater added", data: newTheater }, 201);
    } catch (err: any) {
      return error("Internal Server Error", 500, err.message);
    }
  }

