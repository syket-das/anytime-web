"use client"

import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminSidebar } from "./admin-sidebar"
import { UserNav } from "./user-nav"

export function AdminHeader() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
        <h1 className="ml-4 md:ml-0 font-semibold text-lg">{title}</h1>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  )
}

function getPageTitle(pathname: string): string {
  if (pathname === "/admin") return "Dashboard"

  // Extract the last part of the path and format it
  const path = pathname.split("/").pop() || ""
  return path
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

