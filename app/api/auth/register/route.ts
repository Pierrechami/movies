import { NextResponse } from "next/server";
import { error, success } from "@/utils/responses";
import { registerUser } from "@/services/auth.service";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const body = await req.json();
        const user = await registerUser(body);
        return success({ message: "Utilisateur créé", data: user }, 201);
      } catch (err: any) {
        return error(err.message || "Erreur serveur", err.status || 500, err.error);
      }

}