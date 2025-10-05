"use client";

import { usePathname } from "next/navigation";
import { Bell, UserCircle, Menu, HelpCircle, Sun, Moon, LogOut, ChevronLeft, ChevronRight, Settings, Lock } from "lucide-react";
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
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyProvider";

const AppHeader = ({ onToggleSidebar = () => {}, isSidebarCollapsed = false }) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const { currency, setCurrency } = useCurrency();

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
    <header className="sticky z-40 h-20 bg-white dark:bg-[#091C2D]/90 backdrop-blur border-b border-gray-200 dark:border-white/10">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            {isSidebarCollapsed ? <ChevronRight size={24} className="text-gray-700 dark:text-gray-300" /> : <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />}
          </button>
          <Link href="/main/my-profile" className="flex items-center gap-2">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center">
                <UserCircle size={20} className="text-gray-600 dark:text-gray-300" />
              </div>
            )}
          </Link>
          <h1 className="text-lg sm:text-xl font-semibold tracking-wide text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-6">
            <Bell size={24} className="text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white" />
            
            <Sheet>
                <SheetTrigger asChild>
                    <button
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none"
                        aria-label="Open Settings"
                    >
                        <Settings size={24} className="text-gray-700 dark:text-gray-300" />
                    </button>
                </SheetTrigger>
                <SheetContent className="bg-white dark:bg-[#0F2334] border-l border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                    <SheetHeader>
                        <SheetTitle className="text-teal-600 dark:text-teal-400">Settings</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8 flex flex-col gap-2">
                        <Button asChild variant="ghost" className="justify-start gap-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">
                            <Link href="/main/my-profile"><UserCircle size={18} /> My Profile</Link>
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">
                            <Lock size={18} /> Change Password
                        </Button>
                        <hr className="border-gray-200 dark:border-white/10 my-4" />
                        <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">Currency</div>
                        <Button variant="ghost" className="justify-start gap-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10" onClick={() => setCurrency('USD')}>
                            USD - US Dollar
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10" onClick={() => setCurrency('MYR')}>
                            MYR - Malaysian Ringgit
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10" onClick={() => setCurrency('IDR')}>
                            IDR - Indonesian Rupiah
                        </Button>
                        <hr className="border-gray-200 dark:border-white/10 my-4" />
                        <Button variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="justify-start gap-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            Switch Theme
                        </Button>
                        <Button variant="ghost" onClick={() => signOut()} className="justify-start gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
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
