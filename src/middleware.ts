import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { ExtendedNextRequest } from "types";
import { getServerAuthSession } from "./lib/auth";
import { verifyJwt } from "./lib/jwt";

// Extend the NextRequest interface to include the 'userId' property

// This function can be marked `async` if using `await` inside
export async function middleware(request: ExtendedNextRequest) {
  const session = await getServerAuthSession();

  const authToken = request.headers.get("Authorization");

  if (!authToken || !session?.user?.id) {
    return NextResponse.json(
      { error: "Failed to authenticate the request!" },
      { status: 400 }
    );
  }

  try {
    if (session?.user?.id) {
      request.userId = session.user.id;
      return;
    }

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
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to authenticate the request!" },
      { status: 400 }
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/api/user/profile", "/api/deposit"],
};
