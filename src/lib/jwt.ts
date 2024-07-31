import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export const signJwt = async (payload: any) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
};

export const verifyJwt = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return { error: null, decoded: payload };
  } catch (error) {
    return { error, decoded: null };
  }
};
