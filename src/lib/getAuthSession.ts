import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getAuthSession(req: any, res: any) {
  const session = await getServerSession(req, res, authOptions);

  return session;
}
