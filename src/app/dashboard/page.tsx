import React from "react";

import Transactions from "./_components/Transactions";
import ExchangeRate from "./_components/ExchangeRate";
import ExchangeCalculator from "./_components/ExchangeCalculator";
import PersonalWallet from "./_components/PersonalWallet";

const Page = () => {
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 ">
        <div className="sm:col-span-1">
          <ExchangeRate />
        </div>
        <div className="sm:col-span-2">
          <ExchangeCalculator />
        </div>
        <div className="sm:col-span-1">
          <PersonalWallet />
        </div>
      </div>
      <Transactions />
    </div>
  );
};

export default Page;
