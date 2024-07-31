import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { authOptions } from "./lib/auth";
import { verifyJwt } from "./lib/jwt";

// Extend the NextRequest interface to include the 'userId' property
interface ExtendedNextRequest extends NextRequest {
  userId?: string;
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: ExtendedNextRequest) {
  console.log("middleware");

  const authToken = request.headers.get("Authorization");

  if (!authToken) {
    return NextResponse.json(
      { error: "Failed to authenticate the request!" },
      { status: 400 }
    );
  }

  try {
    const {
      error,
      decoded,
    }: {
      error: any;
      decoded: any;
    } = await verifyJwt(authToken);

    if (error) {
      return NextResponse.json(
        { error: "Failed to authenticate the request!" },
        { status: 400 }
      );
    }

    request.userId = decoded.id;
    return NextResponse.next();
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
