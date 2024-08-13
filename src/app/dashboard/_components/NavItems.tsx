"use client";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CreditCard,
  Home,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavItems: React.FC = () => {
  const pathName = usePathname();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      <Link
        href="/dashboard"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
          pathName === "/dashboard" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <Home className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        href="/dashboard/banks"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
          pathName === "/dashboard/banks"
            ? "text-primary"
            : "text-muted-foreground"
        }`}
      >
        <CreditCard className="h-4 w-4" />
        Banks
      </Link>

      <Link
        href={"/dashboard/transactions"}
        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-muted-foreground  "
      >
        <Settings2 className="h-4 w-4" />
        Transactions
      </Link>

      <Link
        href="/dashboard/deposit"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
          pathName === "/dashboard/deposit"
            ? "text-primary"
            : "text-muted-foreground"
        }`}
      >
        <ArrowDown className="h-4 w-4" />
        Deposit
      </Link>
      <Link
        href="/dashboard/withdraw"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
          pathName === "/dashboard/withdraw"
            ? "text-primary"
            : "text-muted-foreground"
        }`}
      >
        <ArrowUp className="h-4 w-4" />
        Withdraw
      </Link>
      <Link
        href="/dashboard/exchange"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
          pathName === "/dashboard/exchange"
            ? "text-primary"
            : "text-muted-foreground"
        }`}
      >
        <ArrowUpDown className="h-4 w-4" />
        Exchange
      </Link>
    </nav>
  );
};

export default NavItems;
