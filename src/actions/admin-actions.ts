// @ts-nocheck
"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define the STATUS enum
enum STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// Dashboard stats
export async function getDashboardStats() {
  const [totalUsers, totalDeposits, totalExchanges, totalWithdrawals] =
    await Promise.all([
      prisma.user.count(),
      prisma.deposit.count(),
      prisma.exchange.count(),
      prisma.withdrawal.count(),
    ]);

  return {
    totalUsers,
    totalDeposits,
    totalExchanges,
    totalWithdrawals,
  };
}

// User management
export async function getUsers(
  page = 1,
  pageSize = 10,
  search?: string,
  sortBy = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) {
  const skip = (page - 1) * pageSize;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    totalPages: Math.ceil(totalUsers / pageSize),
    totalUsers,
  };
}

export async function updateUser(userId: string, data: any) {
  await prisma.user.update({
    where: { id: userId },
    data,
  });

  revalidatePath("/admin/users");
}

// Admin Banks management
export async function getAdminBanks(
  page = 1,
  pageSize = 10,
  search?: string,
  sortBy = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) {
  const skip = (page - 1) * pageSize;

  const where = search
    ? {
        OR: [
          { type: { contains: search, mode: "insensitive" } },
          { accountNo: { contains: search, mode: "insensitive" } },
          { accountName: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [adminBanks, totalAdminBanks] = await Promise.all([
    prisma.adminBank.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
    }),
    prisma.adminBank.count({ where }),
  ]);

  return {
    adminBanks,
    totalPages: Math.ceil(totalAdminBanks / pageSize),
    totalAdminBanks,
  };
}

const adminBankSchema = z.object({
  type: z.string().min(1, "Bank type is required"),
  accountNo: z.string().min(1, "Account number is required"),
  accountName: z.string().optional(),
  branch: z.string().optional(),
  fullDetails: z.string().optional(),
});

export async function createAdminBank(formData: FormData) {
  const validatedFields = adminBankSchema.safeParse({
    type: formData.get("type"),
    accountNo: formData.get("accountNo"),
    accountName: formData.get("accountName"),
    branch: formData.get("branch"),
    fullDetails: formData.get("fullDetails"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  await prisma.adminBank.create({
    data: validatedFields.data,
  });

  revalidatePath("/admin/admin-banks");
  return { success: true };
}

export async function updateAdminBank(id: string, formData: FormData) {
  const validatedFields = adminBankSchema.safeParse({
    type: formData.get("type"),
    accountNo: formData.get("accountNo"),
    accountName: formData.get("accountName"),
    branch: formData.get("branch"),
    fullDetails: formData.get("fullDetails"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  await prisma.adminBank.update({
    where: { id },
    data: validatedFields.data,
  });

  revalidatePath("/admin/admin-banks");
  return { success: true };
}

export async function deleteAdminBank(id: string) {
  await prisma.adminBank.delete({
    where: { id },
  });

  revalidatePath("/admin/admin-banks");
  return { success: true };
}

// Exchange Rates management
export async function getExchangeRates(
  page = 1,
  pageSize = 10,
  search?: string,
  sortBy = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) {
  const skip = (page - 1) * pageSize;

  const [exchangeRates, totalExchangeRates] = await Promise.all([
    prisma.exchangeRate.findMany({
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
    }),
    prisma.exchangeRate.count(),
  ]);

  return {
    exchangeRates,
    totalPages: Math.ceil(totalExchangeRates / pageSize),
    totalExchangeRates,
  };
}

const exchangeRateSchema = z.object({
  from: z.enum(["USDT", "INR", "BDT"]),
  to: z.enum(["USDT", "INR", "BDT"]),
  rate: z.coerce.number().positive("Rate must be positive"),
});

export async function createExchangeRate(formData: FormData) {
  const validatedFields = exchangeRateSchema.safeParse({
    from: formData.get("from"),
    to: formData.get("to"),
    rate: formData.get("rate"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  await prisma.exchangeRate.create({
    data: validatedFields.data,
  });

  revalidatePath("/admin/exchange-rates");
  return { success: true };
}

export async function updateExchangeRate(id: string, formData: FormData) {
  const validatedFields = exchangeRateSchema.safeParse({
    from: formData.get("from"),
    to: formData.get("to"),
    rate: formData.get("rate"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  await prisma.exchangeRate.update({
    where: { id },
    data: validatedFields.data,
  });

  revalidatePath("/admin/exchange-rates");
  return { success: true };
}

export async function deleteExchangeRate(id: string) {
  await prisma.exchangeRate.delete({
    where: { id },
  });

  revalidatePath("/admin/exchange-rates");
  return { success: true };
}

// Deposits management
export async function getDeposits(
  page = 1,
  pageSize = 10,
  search?: string,
  status?: string,
  sortBy = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) {
  const skip = (page - 1) * pageSize;

  const where: any = {};

  if (search) {
    where.OR = [
      { transactionId: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (status) {
    where.status = status;
  }

  const [deposits, totalDeposits] = await Promise.all([
    prisma.deposit.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        adminBank: true,
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
    }),
    prisma.deposit.count({ where }),
  ]);

  return {
    deposits,
    totalPages: Math.ceil(totalDeposits / pageSize),
    totalDeposits,
  };
}

export async function updateDepositStatus(
  id: string,
  status: string,
  remark?: string
) {
  await prisma.deposit.update({
    where: { id },
    data: {
      status: status as STATUS,
      remark,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/admin/deposits");
  return { success: true };
}

// Exchanges management
export async function getExchanges(
  page = 1,
  pageSize = 10,
  search?: string,
  status?: string,
  sortBy = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) {
  const skip = (page - 1) * pageSize;

  const where: any = {};

  if (search) {
    where.OR = [
      { transactionId: { contains: search, mode: "insensitive" } },
      { reference: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (status) {
    where.status = status;
  }

  const [exchanges, totalExchanges] = await Promise.all([
    prisma.exchange.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        exchangeRate: true,
        bank: true,
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
    }),
    prisma.exchange.count({ where }),
  ]);

  return {
    exchanges,
    totalPages: Math.ceil(totalExchanges / pageSize),
    totalExchanges,
  };
}

export async function updateExchangeStatus(
  id: string,
  status: string,
  transactionId?: string,
  remark?: string
) {
  await prisma.exchange.update({
    where: { id },
    data: {
      status: status as STATUS,
      transactionId,
      remark,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/admin/exchanges");
  return { success: true };
}

// Withdrawals management
export async function getWithdrawals(
  page = 1,
  pageSize = 10,
  search?: string,
  status?: string,
  sortBy = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) {
  const skip = (page - 1) * pageSize;

  const where: any = {};

  if (search) {
    where.OR = [
      { transactionId: { contains: search, mode: "insensitive" } },
      { reference: { contains: search, mode: "insensitive" } },
      { walletAddress: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (status) {
    where.status = status;
  }

  const [withdrawals, totalWithdrawals] = await Promise.all([
    prisma.withdrawal.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
    }),
    prisma.withdrawal.count({ where }),
  ]);

  return {
    withdrawals,
    totalPages: Math.ceil(totalWithdrawals / pageSize),
    totalWithdrawals,
  };
}

export async function updateWithdrawalStatus(
  id: string,
  status: string,
  transactionId?: string,
  remark?: string
) {
  await prisma.withdrawal.update({
    where: { id },
    data: {
      status: status as STATUS,
      transactionId,
      remark,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/admin/withdrawals");
  return { success: true };
}
