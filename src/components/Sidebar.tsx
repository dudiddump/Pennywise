"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const Sidebar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };
  
  return (
    <aside className="hidden h-full lg:flex flex-col bg-[#091C2D] border-r border-white/10 p-4 w-64">
      <nav className="flex-grow space-y-2">
        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route}
              key={item.label}
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
                  width={24}
                  height={24}
                  className={cn("invert brightness-0 transition-all duration-200", {
                    "brightness-100": isActive,
                    "opacity-70": !isActive,
                  })}
              />
              <p className="font-medium">{item.label}</p>
            </Link>
          );
        })}
      </nav>

      <div className="flex-shrink-0 mt-6 space-y-4">
        <div className="p-2 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400 mb-2 px-1">Theme</p>
            <div className="grid grid-cols-2 gap-2">
                <Button variant="ghost" onClick={() => setTheme("light")} className={cn("flex items-center gap-2", theme === 'light' && "bg-white/10")}>
                    <Sun size={16} /> Light
                </Button>
                <Button variant="ghost" onClick={() => setTheme("dark")} className={cn("flex items-center gap-2", theme === 'dark' && "bg-white/10")}>
                    <Moon size={16} /> Dark
                </Button>
            </div>
        </div>

        <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start p-3 gap-4 text-red-400 hover:bg-red-900/50 hover:text-red-300">
            <LogOut size={24} />
            <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
