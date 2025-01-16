import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import React from "react";
import { Wrapper } from "./_components/Wrapper";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const authUser = await auth();

  if (!authUser) {
    return (
      <div>
        <h1>Not authenticated</h1>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: authUser.user.id,
    },
  });

  if (!user?.isVerified) {
    return (
      <div className="flex flex-col gap-8 items-center justify-center h-screen ">
        <h1 className="text-2xl text-center">
          You are not verified to use this application. Please contact the admin
          to verify your account.
        </h1>

        <p className="text-center underline ">
          <Link href="/">Please wait and try again</Link>
        </p>
      </div>
    );
  }

  return <Wrapper>{children}</Wrapper>;
};

export default layout;
