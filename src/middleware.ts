import { NextRequest, NextResponse } from "next/server";
// import { verifyJwt } from "./lib/jwt";
import NextAuth from "next-auth";
import { authConfig } from "./lib/authConfig";

const protectedRoutes = ["/dashboard", "/dashboard/*"];

export const { auth } = NextAuth(authConfig);

// export default auth((request) => {
//   const isAuth = request.auth;

//   console.log("isAuth", isAuth);

// // handle protected routes in client side
// if (protectedRoutes.some((route) => request.url.includes(route))) {
//   if (isAuth) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }
// }
// if (isAuth?.user) {
//   const requestHeaders = new Headers(request.headers);
//   requestHeaders.set("userId", isAuth.user.id);
//   const response = NextResponse.next({
//     request: new Request(request, {
//       headers: requestHeaders,
//     }),
//   });
//   return response;
// }
// // const authToken = request.headers.get("Authorization");
// // if (!authToken || !authToken.startsWith("Bearer ")) {
// //   return NextResponse.json(
// //     { error: "Failed to authenticate the request!" },
// //     { status: 400 }
// //   );
// // }
// // const token = authToken.split(" ")[1];
// // try {
// //   const {
// //     error,
// //     decoded,
// //   }: {
// //     error: any;
// //     decoded: any;
// //   } = await verifyJwt(token);
// //   if (error) {
// //     return NextResponse.json(
// //       { error: "Failed to authenticate the request!" },
// //       { status: 400 }
// //     );
// //   }
// //   const requestHeaders = new Headers(request.headers);
// //   requestHeaders.set("userId", decoded.id);
// //   const response = NextResponse.next({
// //     request: new Request(request, {
// //       headers: requestHeaders,
// //     }),
// //   });
// //   return response;
// // } catch (error) {
// //   console.error("Authentication error:", error);
// //   return NextResponse.json(
// //     { error: "Failed to authenticate the request!" },
// //     { status: 400 }
// //   );
// // }
// });

// See "Matching Paths" below to learn more

export default auth(async function middleware(request: NextRequest) {
  const session = await auth();

  // handle protected routes in client side
  if (protectedRoutes.some((route) => request.url.includes(route))) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  if (session?.user) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("userId", session.user.id);
    const response = NextResponse.next({
      request: new Request(request, {
        headers: requestHeaders,
      }),
    });
    return response;
  }
  // const authToken = request.headers.get("Authorization");
  // if (!authToken || !authToken.startsWith("Bearer ")) {
  //   return NextResponse.json(
  //     { error: "Failed to authenticate the request!" },
  //     { status: 400 }
  //   );
  // }
  // const token = authToken.split(" ")[1];
  // try {
  //   const {
  //     error,
  //     decoded,
  //   }: {
  //     error: any;
  //     decoded: any;
  //   } = await verifyJwt(token);
  //   if (error) {
  //     return NextResponse.json(
  //       { error: "Failed to authenticate the request!" },
  //       { status: 400 }
  //     );
  //   }
  //   const requestHeaders = new Headers(request.headers);
  //   requestHeaders.set("userId", decoded.id);
  //   const response = NextResponse.next({
  //     request: new Request(request, {
  //       headers: requestHeaders,
  //     }),
  //   });
  //   return response;
  // } catch (error) {
  //   console.error("Authentication error:", error);
  //   return NextResponse.json(
  //     { error: "Failed to authenticate the request!" },
  //     { status: 400 }
  //   );
  // }
});

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
    "/dashboard",
    "/dashboard/:slug*",
  ],
};
