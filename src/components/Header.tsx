"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

type Props = { onMenuClick?: () => void };

export default function Header({ onMenuClick }: Props) {
  const pathname = usePathname();

  const titles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/profile": "My Profile",
    "/budgeting": "Budgeting",
    "/investment": "Investment",
    "/expenses": "Expenses",
    "/feedback": "AI Feedback",
  };

  const title =
    titles[pathname] ||
    titles[
      (Object.keys(titles).find((k) => pathname?.startsWith(k)) ?? "/dashboard")
    ] ||
    "Pennywise";

  return (
    <header className="sticky top-0 z-40 h-14 bg-[#091C2D]/90 backdrop-blur border-b border-white/10">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        {/* tombol hamburger (mobile only) */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 focus:outline-none"
          aria-label="Open Menu"
        >
          <Menu size={22} />
        </button>

        {/* logo + judul halaman */}
        <div className="flex items-center gap-3">
          <Image
            src="/Pennywise-Logo.png"
            alt="Pennywise"
            width={28}
            height={28}
            className="rounded"
          />
          <h1 className="text-sm sm:text-base font-semibold tracking-wide">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
}
