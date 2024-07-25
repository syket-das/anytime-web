import "./globals.css";

import { Manrope } from "next/font/google";
import Header from "@/components/universal/Header";
import Footer from "@/components/universal/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export default function RootLayout({ children }: IProps) {
  return (
    <html lang="en" className={manrope.variable}>
      <head />
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

interface IProps {
  children: React.ReactNode;
}
