"use client";

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
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

type SidebarProps = {
  onClose?: () => void;
};

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // PERBAIKAN: Menyesuaikan href dengan struktur folder Anda
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", href: "/my-profile", icon: User },
    { name: "Budgeting", href: "/my-budget", icon: CreditCard },
    { name: "Investment", href: "/my-investment", icon: LineChart },
    { name: "Expenses", href: "/my-expenses", icon: Wallet },
    { name: "AI Feedback", href: "/my-feedback", icon: MessageCircle },
  ];

  return (
    <aside className="hidden lg:flex flex-col h-full bg-[#091C2D] text-gray-200 p-4 w-64 border-r border-white/10">
      <div className="flex items-center gap-2 mb-5 justify-center">
        <img src="/pennywise-logo.png" alt="logo" className="h-12 w-12" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                active
                  ? "bg-teal-500 text-white"
                  : "text-gray-300 hover:bg-[#132E4D] hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-700 my-4" />

      <div className="flex flex-col gap-2">
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-[#132E4D] hover:text-white"
        >
          <Moon size={18} />
          Switch Theme
        </Button>

        <Button
          variant="ghost"
          onClick={() => signOut()}
          className="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-[#132E4D] hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
