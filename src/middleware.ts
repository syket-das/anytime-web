import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyJwt } from "./lib/jwt";

// Extend the NextRequest interface to include the 'userId' property

export async function middleware(request: NextRequest) {
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
    "/api/user/userbank",
    "/api/user/withdraw",
    "/api/user/balance",
    "/api/user/exchange",
  ],
};
