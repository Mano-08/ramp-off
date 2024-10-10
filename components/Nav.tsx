"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Orders", href: "/crypto/orders" },
];

function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { address } = useAccount();
  const session: any = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push("/signin");
  };
  console.log("oreys", session);
  return (
    <>
      <nav
        className="h-[10vh] bg-transparent w-screen fixed top-0	left-0 px-4 py-1 lg:px-16 lg:py-3  flex flex-row justify-between items-center"
        aria-label="Top"
      >
        <div className="flex items-center gap-4 flex-row">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex flex-row justify-end items-center space-x-6">
          {session?.data?.user && (
            <div className="flex items-center space-x-2">
              <img
                src={session.data.user.picture}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-semibold">
                {session.data.user.name}
              </span>
            </div>
          )}
          <ConnectButton />
          {session?.data?.user && (
            <button
              onClick={handleSignOut}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700"
            >
              Sign Out
            </button>
          )}
        </div>

        <div className="lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-around rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">P2P</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="P2P Logo"
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            {session?.data?.user && (
              <div className="flex items-center space-x-2 px-3 py-2">
                <img
                  src={session.data.user.picture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-base font-semibold">
                  {session.data.user.name}
                </span>
              </div>
            )}
            <div className="space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block transition-all duration-200 ease-in-out rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  {item.name}
                </a>
              ))}

              <div className="block transition-all duration-200 ease-in-out rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                <ConnectButton />
              </div>
              {session?.data?.user && (
                <button
                  onClick={handleSignOut}
                  className="w-full transition-all duration-200 ease-in-out text-left block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-red-100"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

export default Nav;
