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
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
};

export default function Sidebar({ onClose = () => {}, onToggleSidebar = () => {}, isSidebarCollapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  
  const navItems = [
    { name: "My Profile", href: "/main/my-profile", icon: User },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Budgeting", href: "/main/my-budget", icon: CreditCard },
    { name: "Expenses", href: "/main/my-expenses", icon: Wallet },
    { name: "Investment", href: "/main/my-investment", icon: LineChart },
    { name: "AI Chatbot", href: "/main/my-ai-chat", icon: MessageCircle },
  ];

  return (
    <aside className={`hidden lg:flex flex-col h-full bg-white dark:bg-[#091C2D] text-gray-900 dark:text-gray-200 p-4 border-r border-gray-200 dark:border-white/10 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center gap-2 mb-5 justify-center">
        {isSidebarCollapsed ? (
          <img src="/pennywise-logo.png" alt="logo" className="h-8 w-8" />
        ) : (
          <img src="/pennywise-logo.png" alt="logo" className="h-12 w-12" />
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center rounded-lg px-3 py-2 transition-colors ${
                active
                  ? "bg-teal-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#132E4D] hover:text-gray-900 dark:hover:text-white"
              } ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}
            >
              <Icon size={18} />
              {!isSidebarCollapsed && item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

      <div className="flex flex-col gap-2">
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`flex items-center rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#132E4D] hover:text-gray-900 dark:hover:text-white ${isSidebarCollapsed ? 'justify-center' : 'justify-start gap-3'}`}
        >
          <Moon size={18} />
          {!isSidebarCollapsed && "Switch Theme"}
        </Button>

        <Button
          variant="ghost"
          onClick={() => signOut()}
          className={`flex items-center rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#132E4D] hover:text-gray-900 dark:hover:text-white ${isSidebarCollapsed ? 'justify-center' : 'justify-start gap-3'}`}
        >
          <LogOut size={18} />
          {!isSidebarCollapsed && "Logout"}
        </Button>
      </div>
    </aside>
  );
}
