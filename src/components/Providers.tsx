"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
<<<<<<< HEAD
import { Toaster } from "@/components/ui/toaster";
=======
import { Toaster } from "@/components/ui/toaster"; // Pastikan path ini sesuai dengan komponen toaster Anda
>>>>>>> a17ffeb (update)

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
}
