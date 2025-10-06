"use client";

import { useSidebar } from "@/context/SidebarContext";
import { useCurrency } from "@/context/CurrencyProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  UserCircle,
  Settings,
  Lock,
  LogOut,
  Menu,
} from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import MobileNav from "./MobileNav";

const AppHeader = () => {
  const { toggleSidebar } = useSidebar();

  const pathname = usePathname();
  const { data: session } = useSession();
  const { currency, setCurrency } = useCurrency();

  const titles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/my-profile": "My Profile",
    "/my-budget": "Budgeting",
    "/my-expenses": "Expenses",
    "/my-investment": "Investment",
    "/my-feedback": "AI Feedback",
  };

  const title = titles[pathname] || "Pennywise";

  return (
    <header className="sticky z-40 h-16 bg-white dark:bg-[#091C2D]/90 backdrop-blur border-b border-gray-200 dark:border-white/10">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <MobileNav />
          </div>

          <div className="hidden lg:block">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <Menu size={20} />
            </Button>
          </div>

          <Link href="/dashboard" className="flex items-center">
            <img
              src="/pennywise-logo.png"
              alt="Pennywise Logo"
              className="h-8 w-8 mr-2"
            />
          </Link>
          <h1 className="text-lg font-semibold tracking-wide text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/notifications">
            <Bell
              size={20}
              className="text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
            />
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <button
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none"
                aria-label="Open Settings"
              >
                <Settings
                  size={20}
                  className="text-gray-700 dark:text-gray-300"
                />
              </button>
            </SheetTrigger>
            <SheetContent className="bg-white dark:bg-[#0F2334] border-l border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
              <SheetHeader>
                <SheetTitle className="text-teal-600 dark:text-teal-400">
                  Settings
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-2">
                <Button asChild variant="ghost" className="justify-start gap-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">
                  <Link href="/main/my-profile">
                    <UserCircle size={18} /> My Profile
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="justify-start gap-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">
                  <Link href="/change-password">
                    <Lock size={18} /> Change Password
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start gap-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10" onClick={() => signOut()}>
                  <LogOut size={18} /> Logout
                </Button>
                <hr className="border-gray-200 dark:border-white/10 my-4" />
                <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">Currency</div>
                <Button variant="ghost" className={`justify-start gap-3 hover:bg-gray-100 dark:hover:bg-white/10 ${currency === 'USD' ? 'bg-gray-100 dark:bg-white/10 text-teal-600 dark:text-teal-400' : 'text-gray-900 dark:text-white'}`} onClick={() => setCurrency('USD')}>
                  USD - US Dollar
                </Button>
                <Button variant="ghost" className={`justify-start gap-3 hover:bg-gray-100 dark:hover:bg-white/10 ${currency === 'MYR' ? 'bg-gray-100 dark:bg-white/10 text-teal-600 dark:text-teal-400' : 'text-gray-900 dark:text-white'}`} onClick={() => setCurrency('MYR')}>
                  MYR - Malaysian Ringgit
                </Button>
                <Button variant="ghost" className={`justify-start gap-3 hover:bg-gray-100 dark:hover:bg-white/10 ${currency === 'IDR' ? 'bg-gray-100 dark:bg-white/10 text-teal-600 dark:text-teal-400' : 'text-gray-900 dark:text-white'}`} onClick={() => setCurrency('IDR')}>
                  IDR - Indonesian Rupiah
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