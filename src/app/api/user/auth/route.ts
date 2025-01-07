import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      // Return a response immediately and exit the function
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 }
      );
    }

    const { data: userData, error: authError } =
      await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !userData) {
      return NextResponse.json(
        { error: "Invalid or expired access token!" },
        { status: 401 }
      );
    }

    const { user: u } = userData;

    const userExists = await prisma.user.findUnique({
      where: {
        email: u.email,
      },
    });

    if (userExists) {
      const token = await signJwt({ id: userExists.id });
      return NextResponse.json({ user: userExists, token });
    }

    const user = await prisma.user.create({
      data: {
        image: u.user_metadata.avatar_url || "",
        email: u.email,
        name: u.user_metadata.full_name || u.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Error creating user!" },
        { status: 500 }
      );
    }

    // Return a success response if user creation is successful
    const token = await signJwt({ id: user.id });
    return NextResponse.json({ user, token });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
