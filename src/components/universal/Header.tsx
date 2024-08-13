"use client";

import { SVGAttributes, useState, Suspense, lazy } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

import useScrollPosition from "@/hooks/useScrollPosition";
import Button from "./Button";
import { signIn, signOut, useSession } from "next-auth/react";
const HeaderMenu = lazy(() => import("./HeaderMenu"));

export default function Header() {
  const { data: session, status } = useSession();

  const PADDING_Y = 24;
  const [isOpen, setIsOpen] = useState(false);
  const scrollTop = useScrollPosition();
  const isSticky = scrollTop > PADDING_Y;
  const top = Math.max(0, PADDING_Y - scrollTop);

  const handleSignIn = () => {
    signIn("google", {
      redirect: false,
    });
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <header
        style={{ top: `calc(${top}px * var(--small))` }}
        className={`fixed [--small:0] md:[--small:1] w-full h-[3.25rem] ${
          isSticky && "bg-primary transition-colors"
        } z-20 whitespace-nowrap ${
          isSticky ? "shadow-[0_8px_20px_rgb(50_12_192_/_30%)]" : ""
        }`}
      >
        <div className="container flex justify-between items-center h-full">
          <Link
            className="block uppercase text-white !font-black text-base sm:text-xl"
            href="/"
          >
            {" Anytime  P2P"}
          </Link>
          <nav
            aria-label="primary navigation"
            className="hidden md:block h-full"
          >
            <ul className="flex justify-center items-center gap-x-6 lg:gap-x-8 text-white text-sm h-full">
              <li className="group h-full flex flex-col justify-center">
                <Link href="/">Home</Link>
              </li>
              <li className="group h-full flex flex-col justify-center">
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="#">Help Center</Link>
              </li>
            </ul>
          </nav>
          <div className="hidden md:block">
            {!session?.user?.id ? (
              <Button
                onClick={session ? handleSignOut : handleSignIn}
                href="#"
                bgColor="orange"
                rounded={isSticky ? "rounded-0" : "rounded-lg"}
                className="h-[3rem]"
              >
                Join Now <FcGoogle size={24} className="ml-2" />
              </Button>
            ) : (
              <Button
                href="/dashboard"
                bgColor="primary"
                rounded={isSticky ? "rounded-0" : "rounded-lg"}
                className="h-[3rem]"
              >
                {"Dashboard"}
              </Button>
            )}
          </div>
          <button
            aria-label="open navigation menu"
            onClick={() => setIsOpen(true)}
            className="md:hidden"
          >
            <HamburgerMenu />
          </button>
        </div>
      </header>

      {isOpen && (
        <Suspense>
          <HeaderMenu onClose={() => setIsOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

const HamburgerMenu = (props: SVGAttributes<SVGSVGElement>) => (
  <svg width="38px" height="38px" viewBox="0 0 24 24" {...props}>
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Menu">
        <rect fillRule="nonzero" x="0" y="0" width="24" height="24"></rect>
        <line
          x1="5"
          y1="7"
          x2="19"
          y2="7"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        ></line>
        <line
          x1="5"
          y1="17"
          x2="19"
          y2="17"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        ></line>
        <line
          x1="5"
          y1="12"
          x2="19"
          y2="12"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        ></line>
      </g>
    </g>
  </svg>
);

const ChevronDown = (props: SVGAttributes<SVGSVGElement>) => (
  <svg width="0" height="0" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <polygon
      strokeWidth="2"
      stroke="currentColor"
      points="12 20.1 0.1 8.2 2.9 5.3 12 14.4 21.1 5.3 23.9 8.2 12 20.1"
    />
  </svg>
);
