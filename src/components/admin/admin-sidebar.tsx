"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Building,
  DollarSign,
  ArrowDownUp,
  ArrowDown,
  ArrowUp,
  Settings,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Admin Banks",
    href: "/admin/admin-banks",
    icon: Building,
  },
  {
    title: "Exchange Rates",
    href: "/admin/exchange-rates",
    icon: DollarSign,
  },
  {
    title: "Deposits",
    href: "/admin/deposits",
    icon: ArrowDown,
  },
  {
    title: "Exchanges",
    href: "/admin/exchanges",
    icon: ArrowDownUp,
  },
  {
    title: "Withdrawals",
    href: "/admin/withdrawals",
    icon: ArrowUp,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col w-64 border-r bg-card h-screen sticky top-0">
      <div className="p-6 border-b">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-bold text-xl"
        >
          <Settings className="h-6 w-6" />
          <span>Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
