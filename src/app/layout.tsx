"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      {/* Background global + font */}
      <body className="bg-[#091C2D] text-white font-poppins">
        <Providers>
          {/* Sidebar: selalu fixed; di mobile jadi drawer (translate) */}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#091C2D] p-4 border-r border-white/10
              transition-transform duration-300 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              md:translate-x-0`}  // <— di desktop selalu terlihat
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>

          {/* Overlay gelap saat sidebar dibuka di mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main area: geser supaya tidak ketiban sidebar; konten yang scroll */}
          <div className="ml-0 md:ml-64 flex h-screen flex-col">
            <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
            <main className="flex-1 overflow-y-auto">
              {/* kasih wrapper content supaya rapi & tidak terlalu lebar */}
              <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
