"use client";

import { SidebarProvider } from "@/context/SidebarContext";
import { CurrencyProvider } from "@/context/CurrencyProvider";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import BottomNavbar from "@/components/BottomNavbar";

export default function MainAppLayout({ children }: { children: React.ReactNode }) {
  return (
    // Bungkus semua dengan Provider
    <CurrencyProvider>
      <SidebarProvider>
        <LayoutContent>
          {children}
        </LayoutContent>
      </SidebarProvider>
    </CurrencyProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-white dark:bg-[#091C2D] text-gray-900 dark:text-white">
      <div className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-[rgba(52,211,153,0.15)] blur-[100px]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-[rgba(59,130,246,0.15)] blur-[100px]"></div>
      </div>

      <div className="flex h-screen">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
            {children}
          </main>
        </div>
      </div>
      <div className="lg:hidden">
        <BottomNavbar />
      </div>
    </div>
  );
}
