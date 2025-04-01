import { NextResponse } from "next/server";
import { loginUser } from "@/services/auth.service";
import { error, success } from "@/utils/responses";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { accessToken, user } = await loginUser(body);

    return success({
        message: "Connexion réussie",
        token: accessToken,
        data: {
          name: user.name,
          email: user.email,
        },
      }, 200);
  } catch (err: any) {
    return error(err.message || "Erreur serveur", err.status || 500, err.error);
  }
}
