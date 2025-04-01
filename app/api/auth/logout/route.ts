import { NextResponse } from "next/server";
import { logoutUser } from "@/services/auth.service";
import { error, success } from "@/utils/responses";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const result = await logoutUser(req);
    return success(result);
  } catch (err: any) {
    return error(err.message || "Déconnexion échouée", err.status || 500, err.error);
  }
}