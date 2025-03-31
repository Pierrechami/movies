import { NextResponse } from "next/server";

export interface SuccessResponse<T> {
  status: number;
  message?: string;
  data: T;
}

export interface ErrorResponse {
  status: number;
  message: string;
  error?: unknown;
}

export function success<T>(data: T, status = 200) {
  const response = { status, ...data };
  return NextResponse.json(response, { status });
}

export function error(message: string, status = 500, errorDetail?: unknown) {
  const response: ErrorResponse = { status, message };
  if (errorDetail !== undefined) {
    response.error = errorDetail;
  }
  return NextResponse.json(response, { status });
}
