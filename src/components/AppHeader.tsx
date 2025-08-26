"use client";

import { usePathname } from "next/navigation";
import { Bell, UserCircle, Menu, HelpCircle, Sun, Moon, LogOut } from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import Link from "next/link";

const AppHeader = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const titles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/my-profile": "My Profile",
    "/my-budget": "Budgeting",
    "/my-investment": "Investment",
    "/my-expenses": "Expenses",
    "/my-feedback": "AI Feedback",
  };

  const title = titles[pathname] || "Pennywise";

  return (
    <header className="sticky top-2 pb-2 z-40 h-20 bg-[#091C2D]/90 backdrop-blur border-b border-white/10">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/pennywise-logo.png"
            alt="Pennywise"
            width={32}
            height={32}
            className="rounded"
          />
          <h1 className="text-lg sm:text-xl font-semibold tracking-wide text-white">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-6">
            <Bell size={24} className="text-gray-300 cursor-pointer hover:text-white" />
            <UserCircle size={24} className="hidden sm:block text-gray-300 cursor-pointer hover:text-white" />
            
            <Sheet>
                <SheetTrigger asChild>
                    <button
                        className="lg:hidden p-1 rounded-lg hover:bg-white/10 focus:outline-none"
                        aria-label="Open Menu"
                    >
                        <Menu size={24} className="text-gray-300" />
                    </button>
                </SheetTrigger>
                <SheetContent className="bg-[#0F2334] border-l border-white/10 text-white">
                    <SheetHeader>
                        <SheetTitle className="text-teal-400">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8 flex flex-col gap-2">
                        <Button variant="ghost" className="justify-start gap-3">
                            <Bell size={18} /> Notifications
                        </Button>
                        <Button asChild variant="ghost" className="justify-start gap-3">
                            <Link href="/my-profile"><UserCircle size={18} /> My Profile</Link>
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3">
                            <HelpCircle size={18} /> Help
                        </Button>
                        <Button variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="justify-start gap-3">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            Switch Theme
                        </Button>
                        <hr className="border-white/10 my-4" />
                        <Button variant="ghost" onClick={() => signOut()} className="justify-start gap-3 text-red-400 hover:text-red-400 hover:bg-red-500/10">
                            <LogOut size={18} /> Logout
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
