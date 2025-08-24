"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { Menu, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// Komponen MobileNav (Menu Geser)
const MobileNav = () => {
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="text-white">
          <Menu size={28} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-[#091C2D] border-r-0 text-white p-4">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <Image
            src="/Pennywise-Logo.png"
            alt="Pennywise"
            width={100}
            height={100}
          />
        </Link>
        <div className="flex flex-col h-[calc(100vh-80px)]">
          <nav className="flex-grow space-y-2">
            {sidebarLinks.map((item) => {
              const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
              return (
                <SheetClose asChild key={item.route}>
                  <Link
                    href={item.route}
                    className={cn(
                      "flex items-center p-3 rounded-lg gap-4 transition-colors",
                      {
                        "bg-white/10 text-white": isActive,
                        "hover:bg-white/5 text-gray-300": !isActive,
                      }
                    )}
                  >
                    <Image
                      src={item.imgURL}
                      alt={item.label}
                      width={20}
                      height={20}
                      className={cn("invert brightness-0 transition-all duration-200", {
                        "brightness-100": isActive,
                        "opacity-70": !isActive,
                      })}
                    />
                    <p className="font-medium">{item.label}</p>
                  </Link>
                </SheetClose>
              );
            })}
          </nav>
          <div className="mt-auto">
             <button onClick={handleSignOut} className="w-full flex items-center p-3 gap-4 text-red-400 hover:bg-red-900/50 hover:text-red-300 rounded-lg transition-colors">
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
             </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Navbar = () => {
  return (
    <header className="p-4 flex justify-between items-center bg-[#091C2D] text-white lg:hidden sticky top-0 z-50 border-b border-white/10">
      <div className="text-lg font-bold">
        Dashboard
      </div>
      <div>
        <MobileNav />
      </div>
    </header>
  );
};

export default Navbar;
