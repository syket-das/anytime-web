import "./globals.css";

import { Manrope } from "next/font/google";
import Header from "@/components/universal/Header";
import Footer from "@/components/universal/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export default function RootLayout({ children }: IProps) {
  return (
    <html lang="en" className={manrope.variable}>
      <head />
      <AuthProvider>
        <TooltipProvider>
          <body>
            <main>{children}</main>
          </body>
        </TooltipProvider>
      </AuthProvider>
    </html>
  );
}

interface IProps {
  children: React.ReactNode;
}
