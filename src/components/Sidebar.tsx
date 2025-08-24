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

type SidebarProps = {
  onClose?: () => void;
};

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", href: "/profile", icon: User },
    { name: "Budgeting", href: "/budgeting", icon: CreditCard },
    { name: "Investment", href: "/investment", icon: LineChart },
    { name: "Expenses", href: "/expenses", icon: Wallet },
    { name: "AI Feedback", href: "/feedback", icon: MessageCircle },
  ];

  return (
    <div className="flex flex-col h-full bg-[#091C2D] text-gray-200 p-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-2xl font-bold text-teal-400">💰 Pennywise</span>
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
    </div>
  );
}
