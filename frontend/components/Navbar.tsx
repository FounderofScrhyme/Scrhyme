"use client";

import { useState } from "react";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import {
  LayoutDashboard,
  ShieldQuestionIcon,
  ReceiptTextIcon,
} from "lucide-react";

const navLinks = [
  {
    label: "Home",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "What's Scrhyme?",
    href: "/about",
    icon: ShieldQuestionIcon,
  },
  {
    label: "Terms of Service",
    href: "/terms",
    icon: ReceiptTextIcon,
  },
];

export default function Navbar() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [openMenu, setOpenMenu] = useState(false);
  const handleMenuOpen = () => {
    setOpenMenu(!openMenu);
  };

  if (!isLoaded) {
    return (
      <div className="w-full">
        <header className=" flex items-center justify-between py-4 px-5">
          <div>
            <h1 className="font-bold whitespace-nowrap text-lg text-white">
              Scrhyme
            </h1>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isSignedIn ? (
        <header className="fixe flex items-center justify-between py-4 px-5">
          <div className="flex items-center gap-2 z-50">
            <Image
              src="/logo.webp"
              alt="Scrhyme Logo"
              width={32}
              height={32}
              priority
            />
            <h1 className="font-bold text-2xl whitespace-nowrap text-white">
              Scrhyme
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden md:flex space-x-2">
                <SignOutButton>
                  <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-400 via-slate-300 to-sky-500 hover:opacity-80 rounded-full">
                    <span className="bg-white/10 text-white rounded-full font-semibold backdrop-blur-sm">
                      Sign out
                    </span>
                  </div>
                </SignOutButton>
              </div>

              <button onClick={handleMenuOpen} className="space-y-2 z-50">
                <div
                  className={
                    openMenu
                      ? "w-8 h-0.5 bg-neutral-400 translate-y-2.5 rotate-45 transition duration-300 ease-in-out"
                      : "w-8 h-0.5 bg-neutral-400 transition duration-300 ease-in-out"
                  }
                />
                <div
                  className={
                    openMenu
                      ? "opacity-0 transition duration-500 ease-in-out"
                      : "w-8 h-0.5 bg-neutral-400 transition duration-300 ease-in-out"
                  }
                />
                <div
                  className={
                    openMenu
                      ? "w-8 h-0.5 bg-neutral-400 -rotate-45 transition duration-300 ease-in-out"
                      : "w-8 h-0.5 bg-neutral-400 transition duration-300 ease-in-out"
                  }
                />
              </button>
            </div>
          </div>

          <nav
            className={
              openMenu
                ? "fixed text-center bg-white right-0 top-0 w-[100%] lg:w-[25%] h-screen flex flex-col justify-center ease-linear duration-500 dark:bg-neutral-950 z-40"
                : "fixed right-[-100%] top-0 w-[100%] md:w-[25%] h-screen flex flex-col justify-center ease-linear duration-400"
            }
          >
            <ul className="mt-8 space-y-4 flex flex-col items-center">
              {navLinks.map((navLink) => {
                const IconComponent = navLink.icon;
                return (
                  <li
                    key={navLink.label}
                    className="py-4 font-medium flex items-center gap-3"
                  >
                    <div className="w-5 flex justify-center">
                      <IconComponent size={20} className="text-slate-100" />
                    </div>
                    {navLink.label}
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>
      ) : (
        <header className="relative flex items-center justify-between py-4 px-5">
          <div className="flex items-center gap-2 z-50">
            <Image
              src="/logo.webp"
              alt="Scrhyme Logo"
              width={32}
              height={32}
              priority
            />
            <h1 className="font-bold text-2xl whitespace-nowrap text-white">
              Scrhyme
            </h1>
          </div>

          <div className="flex flex-1" />

          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <div className="md:hidden inline-block px-6 py-2 bg-gradient-to-r from-purple-400 via-slate-300 to-sky-500 hover:opacity-80 rounded-full">
                <span className=" bg-white/10 text-white rounded-full font-semibold backdrop-blur-sm">
                  Sign in
                </span>
              </div>
            </SignInButton>
            <div className="hidden md:flex space-x-2">
              <SignInButton mode="modal">
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-400 via-slate-300 to-sky-500 hover:opacity-80 rounded-full">
                  <span className="bg-white/10 text-white rounded-full font-semibold backdrop-blur-sm">
                    Sign in
                  </span>
                </div>
              </SignInButton>

              <SignUpButton mode="modal">
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:opacity-80 rounded-full">
                  <span className="bg-white/10 text-white rounded-full font-semibold backdrop-blur-sm">
                    Sign up
                  </span>
                </div>
              </SignUpButton>
            </div>

            <button onClick={handleMenuOpen} className="z-10 space-y-2">
              <div
                className={
                  openMenu
                    ? "w-8 h-0.5 bg-slate-100 translate-y-2.5 rotate-45 transition duration-300 ease-in-out"
                    : "w-8 h-0.5 bg-slate-900 transition duration-300 ease-in-out"
                }
              />
              <div
                className={
                  openMenu
                    ? "opacity-0 transition duration-500 ease-in-out"
                    : "w-8 h-0.5 bg-slate-100 transition duration-300 ease-in-out"
                }
              />
              <div
                className={
                  openMenu
                    ? "w-8 h-0.5 bg-slate-100 -rotate-45 transition duration-300 ease-in-out"
                    : "w-8 h-0.5 bg-slate-100 transition duration-300 ease-in-out"
                }
              />
            </button>
          </div>

          <nav
            className={
              openMenu
                ? "fixed text-center bg-slate-500 right-0 top-0 w-[100%] lg:w-[25%] h-screen flex flex-col justify-center ease-linear duration-500"
                : "fixed right-[-100%] top-0 w-[100%] md:w-[25%] h-screen flex flex-col justify-center ease-linear duration-400"
            }
          >
            <ul className="space-y-4 flex flex-col mx-auto items-left">
              {navLinks.map((navLink) => {
                const IconComponent = navLink.icon;
                return (
                  <li
                    key={navLink.label}
                    className="py-2 font-medium flex items-center gap-3"
                  >
                    <div className="w-5 flex justify-center">
                      <IconComponent size={20} className="text-slate-100" />
                    </div>
                    {navLink.label}
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>
      )}
    </div>
  );
}
