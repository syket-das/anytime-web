import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./lib/authConfig";

const { auth } = NextAuth(authConfig);

// Define the public routes and default redirect paths
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"]; // Adjust as needed
const ROOT = "/login"; // Redirect for unauthenticated users
const DEFAULT_REDIRECT = "/dashboard"; // Redirect for authenticated users

export default auth((req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  // Redirect authenticated users away from public routes
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, nextUrl));
  }

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL(ROOT, nextUrl));
  }

  // Allow request to proceed if no redirection is needed
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except API, static assets, and favicon
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
