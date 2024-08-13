"use client";

import { SVGAttributes, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Times from "@/images/times-x.min.svg";
import Button from "./Button";
import { signIn, signOut, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const HeaderMenu = ({ onClose }: { onClose: () => void }) => {
  const { data: session, status } = useSession();

  const [subMenu, setSubMenu] = useState({
    product: false,
    template: false,
  });

  const handleSignIn = () => {
    signIn("google", {
      redirect: false,
    });
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <nav
      aria-label="primary mobile navigation"
      className="block animate-fade-in md:hidden w-full pb-20 fixed top-0 z-20 bg-primary"
    >
      <button
        onClick={onClose}
        className="text-white text-xl float-right mt-5 mr-4"
      >
        <Image src={Times} width={20} height={20} alt="" />
      </button>
      <ul className="mt-20 flex flex-col gap-y-8 text-white text-xl text-center justify-center items-center">
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
        <li>
          <div className="w-full">
            {!session?.user?.id ? (
              <Button
                onClick={session ? handleSignOut : handleSignIn}
                href="#"
                bgColor="orange"
                className="h-[3rem] w-full"
              >
                Join Now <FcGoogle size={24} className="ml-2" />
              </Button>
            ) : (
              <Button href="/dashboard" bgColor="primary" className="h-[3rem]">
                {"Dashboard"}
              </Button>
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
};

const ChevronDown = (props: SVGAttributes<SVGSVGElement>) => (
  <svg width="0" height="0" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <polygon
      strokeWidth="2"
      stroke="currentColor"
      points="12 20.1 0.1 8.2 2.9 5.3 12 14.4 21.1 5.3 23.9 8.2 12 20.1"
    />
  </svg>
);

export default HeaderMenu;
