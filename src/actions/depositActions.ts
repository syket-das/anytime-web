"use server";

import { prisma } from "@/lib/db";
import { CldUploadButton } from "next-cloudinary";
import { auth } from "@/lib/auth";

export async function createDeposit(formData: FormData) {
  const session = await auth();
  const amount = formData.get("amount");
  const adminBankId = formData.get("adminBankId");
  const imageUrl = formData.get("imageUrl");
  const transactionId = formData.get("transactionId");

  if (!amount || !adminBankId || !imageUrl) {
    throw new Error("Missing required fields");
  }

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Create deposit record
    const deposit = await prisma.deposit.create({
      data: {
        userId: session.user.id,
        amount: parseFloat(amount as string),
        currency: "BDT",
        status: "PENDING",
        transactionId: `DEP-${Date.now()}`,
        adminBankId: adminBankId as string,
        media: {
          key: imageUrl as string,
          url: imageUrl as string,
        },
      },
    });

    return { success: true, deposit };
  } catch (error) {
    console.error("Error creating deposit:", error);
    return { success: false, error: "Failed to create deposit" };
  }
}
