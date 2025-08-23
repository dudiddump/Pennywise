import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/ThemeProvider"; // Pastikan path ini benar

// Konfigurasi kedua font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fintech App",
  description: "User personalized financial dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Hapus className="dark" agar ThemeProvider bisa bekerja
    <html lang="en" suppressHydrationWarning> 
      {/* Gabungkan variabel font di body */}
      <body className={`${inter.variable} ${poppins.variable}`}>
        <AuthProvider>
          {/* ThemeProvider membungkus semua konten di dalam body */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system" // Mengikuti tema OS secara default
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
