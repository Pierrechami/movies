import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/services/auth.service";
import { error, success } from "@/utils/responses";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const result = await refreshAccessToken(req);
        return success(({
            status: 200,
            message: result.message,
            token: result.token,
        }),
        );
    } catch (err: any) {
        return error(err.message || "Erreur lors du rafraîchissement du token", err.status || 500, err.error);
    }
}