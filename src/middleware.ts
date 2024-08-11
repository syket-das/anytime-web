import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { authOptions } from "./lib/auth";
import { verifyJwt } from "./lib/jwt";

export async function middleware(request: NextRequest, ev: NextFetchEvent) {
  const requestForNextAuth = {
    headers: {
      cookie: request.headers.get("cookie"),
    },
  } as any;

  const session = await getSession({ req: requestForNextAuth });

  if (session?.user?.id) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("userId", session.user.id);

    const response = NextResponse.next({
      request: new Request(request, {
        headers: requestHeaders,
      }),
    });

    return response;
  }

  const authToken = request.headers.get("Authorization");

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Failed to authenticate the request!" },
      { status: 400 }
    );
  }

  const token = authToken.split(" ")[1];

  try {
    const {
      error,
      decoded,
    }: {
      error: any;
      decoded: any;
    } = await verifyJwt(token);

    if (error) {
      return NextResponse.json(
        { error: "Failed to authenticate the request!" },
        { status: 400 }
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("userId", decoded.id);

    const response = NextResponse.next({
      request: new Request(request, {
        headers: requestHeaders,
      }),
    });

    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate the request!" },
      { status: 400 }
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/api/user/profile",
    "/api/user/deposit",
    "/api/user/deposit/verify",
    "/api/user/userbank",
    "/api/user/withdraw",
    "/api/user/balance",
    "/api/user/exchange",
    "/api/user/transaction",
  ],
};
