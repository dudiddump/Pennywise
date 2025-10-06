"use client";

import { useSidebar } from "@/context/SidebarContext";
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
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();
  
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Budgeting", href: "/main/my-budget", icon: CreditCard },
    { name: "Expenses", href: "/main/my-expenses", icon: Wallet },
    { name: "Investment", href: "/main/my-investment", icon: LineChart },
    { name: "AI Chatbot", href: "/main/my-ai-chat", icon: MessageCircle },
  ];

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-[#091C2D] text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-white/10 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'} z-30`}>
      
      <div className="flex flex-col h-full p-4">
        {/* Hamburger button at the top of sidebar */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <Menu size={20} />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-6 justify-center">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="Profile"
              width={isSidebarCollapsed ? 32 : 40}
              height={isSidebarCollapsed ? 32 : 40}
              className="rounded-full"
            />
          ) : (
            <div className={`bg-gray-200 dark:bg-gray-700 rounded-full ${isSidebarCollapsed ? 'w-8 h-8' : 'w-10 h-10'} flex items-center justify-center`}>
              <User size={isSidebarCollapsed ? 20 : 24} className="text-gray-600 dark:text-gray-300" />
            </div>
          )}
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-medium text-sm">{session?.user?.username || 'User'}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{session?.user?.email || ''}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = (item.href === '/dashboard' && pathname === item.href) || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-lg px-3 py-2 transition-colors ${
                  active
                    ? "bg-teal-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#132E4D] hover:text-gray-900 dark:hover:text-white"
                } ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}
              >
                <Icon size={18} />
                {!isSidebarCollapsed && <span>{item.name}</span>}
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
      </div>
    </aside>
  );
}