import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";
import { buttonVariants } from "../ui/button";

export default function Button({
  href,
  children,
  bgColor = "purple",
  rounded = "rounded-lg",
  className = "",
  onClick,
}: ButtonProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant: "secondary" }), className)}
      href={href}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

interface ButtonProps {
  href: string;
  children: string | ReactNode;
  bgColor?: "orange" | "primary" | "purple";
  rounded?: string;
  className?: string;
  onClick?: () => void;
}
