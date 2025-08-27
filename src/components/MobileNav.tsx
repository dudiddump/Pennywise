"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Wallet,
  CreditCard,
  LineChart,
  MessageCircle,
  Moon,
  LogOut,
  Menu,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", href: "/my-profile", icon: User },
    { name: "Budgeting", href: "/my-budget", icon: CreditCard },
    { name: "Investment", href: "/my-investment", icon: LineChart },
    { name: "Expenses", href: "/my-expenses", icon: Wallet },
    { name: "AI Feedback", href: "/my-feedback", icon: MessageCircle },
];

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="text-white">
          <Menu size={28} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-[#091C2D] border-r-0 text-white px-4 pt-8 pb-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
            <img src="/pennywise-logo.png" alt="logo" className="h-10 w-10" />
        </div>

        <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                    <SheetClose asChild key={item.name}>
                        <Link
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                                active
                                ? "bg-teal-500 text-white"
                                : "text-gray-300 hover:bg-[#132E4D] hover:text-white"
                            }`}
                        >
                            <Icon size={18} />
                            {item.name}
                        </Link>
                    </SheetClose>
                );
            })}
        </nav>

        <div className="border-t border-gray-700 my-4" />

        <div className="flex flex-col gap-2">
            <button
                onClick={() => alert("Switch theme clicked")}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-[#132E4D] hover:text-white"
            >
                <Moon size={18} />
                Switch Theme
            </button>
            <button
                onClick={() => signOut()}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-[#132E4D] hover:text-white"
            >
                <LogOut size={18} />
                Logout
            </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
