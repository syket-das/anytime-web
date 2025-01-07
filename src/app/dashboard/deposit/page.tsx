import { prisma } from "@/lib/db";
import { DepositClient } from "./_components/deposit-client";

const DepositPage = async () => {
  const adminBanks = await prisma.adminBank.findMany();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Deposit BDT</h1>
      <DepositClient adminBanks={adminBanks} />
    </div>
  );
};

export default DepositPage;
