import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const signJwt = (payload: any) => {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET as string, {
    expiresIn: "30d",
  });
};

export const verifyJwt = (token: string) => {
  let error = null;
  let decoded = null;

  jwt.verify(token, process.env.NEXTAUTH_SECRET as string, (err, result) => {
    if (err) {
      error = err;
    } else {
      decoded = result;
    }
  });

  return { error, decoded };
};
