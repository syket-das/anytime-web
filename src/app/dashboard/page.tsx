import React from "react";

import Transactions from "./_components/Transactions";
import ExchangeRate from "./_components/ExchangeRate";
import ExchangeCalculator from "./_components/ExchangeCalculator";
import PersonalWallet from "./_components/PersonalWallet";
import { auth } from "@/lib/auth";

const Page = async () => {
  return (
    <div className="grid  items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 ">
        <div className="">
          <ExchangeRate />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2">
          <ExchangeCalculator />
        </div>
        <div className="">
          <PersonalWallet />
        </div>
      </div>
      <div className="overflow-x-hidden">
        <Transactions />
      </div>
    </div>
  );
};

export default Page;
