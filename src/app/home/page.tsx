"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Banknote, Wallet, ShieldCheck, BarChart2, PiggyBank, FileText, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
// import Image from 'next/image'; // Dihapus untuk kompatibilitas
// import Link from 'next/link'; // Dihapus untuk kompatibilitas
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Komponen Tombol Ganti Tema
const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="text-gray-400 hover:text-white hover:bg-white/10 dark:hover:text-gray-900 dark:hover:bg-gray-300"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="relative h-full flex flex-col items-center text-center bg-white dark:bg-[#0F2334] p-6 rounded-2xl border border-gray-200 dark:border-white/10 transition-shadow duration-300 shadow-lg dark:shadow-[0_0_15px_rgba(52,211,153,0.2)] hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(52,211,153,0.4)]">
    <div className="bg-teal-100 dark:bg-white/10 text-teal-500 dark:text-[#34D399] w-12 h-12 rounded-lg flex items-center justify-center mb-4 flex-shrink-0">
      {icon}
    </div>
    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

const LandingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { theme } = useTheme();

  const features = [
    { icon: <Wallet size={24} />, title: "Expense Tracking", description: "Easily monitor your spending and categorize transactions." },
    { icon: <Banknote size={24} />, title: "Smart Budgeting", description: "Create and manage budgets with intelligent categorization." },
    { icon: <PiggyBank size={24} />, title: "Savings Goals", description: "Set and track your savings goals to achieve your dreams." },
    { icon: <BarChart2 size={24} />, title: "Investment Insights", description: "Track investments and get AI-driven insights to grow." },
    { icon: <FileText size={24} />, title: "Financial Reports", description: "Generate detailed reports of your financial health." },
    { icon: <ShieldCheck size={24} />, title: "Secure & Private", description: "Your data is encrypted with bank-level security." },
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === features.length - 1 ? 0 : prevIndex + 1));
  }, [features.length]);

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  return (
    <div className="relative min-h-screen w-full bg-gray-50 dark:bg-[#091C2D] text-gray-800 dark:text-white flex flex-col font-poppins overflow-hidden">
      
      {/* Efek gradien hanya untuk dark mode */}
      {theme === 'dark' && (
        <>
            <div className="absolute top-[-25%] left-[-25%] w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_rgba(22,163,74,0.15)_0%,_transparent_75%)] -z-10"></div>
            <div className="absolute bottom-[-25%] right-[-25%] w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.1)_0%,_transparent_75%)] -z-10"></div>
        </>
      )}

      <header className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-end">
        <ThemeSwitcher />
      </header>

      <div className="relative z-10 flex flex-col flex-grow items-center justify-center w-full max-w-6xl mx-auto p-6 pt-20">
        
        <div className="flex-grow flex flex-col items-center justify-center w-full">
          <main className="flex flex-col items-center text-center w-full">
            <div className="flex items-center gap-3 mb-4">
                <img 
                src="/pennywise-logo.png" 
                alt="Pennywise" 
                width={40} 
                height={40} 
                className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
            </div>

            <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight">
              <span className="text-gray-900 dark:text-gray-100">Smart Money, </span>
              <span className="block mt-1 md:inline md:mt-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">Smarter You</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Take control of your financial well-being with our comprehensive platform. Track expenses, manage investments, and achieve your savings goals with AI-driven insights.
            </p>
          </main>

          <div className="md:hidden w-full max-w-xs sm:max-w-sm mt-8 relative">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {features.map((feature, index) => (
                  <div key={index} className="w-full flex-shrink-0 p-1">
                    <FeatureCard {...feature} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {features.map((_, index) => (
                <button key={index} onClick={() => setCurrentIndex(index)} className={cn("w-2 h-2 rounded-full transition-colors", currentIndex === index ? "bg-gray-800 dark:bg-white" : "bg-gray-300 dark:bg-white/30")} />
              ))}
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        <div className="w-full flex-shrink-0 pt-8">
            <footer className="md:hidden w-full max-w-md mx-auto text-center space-y-4">
              <Button asChild className="w-full bg-teal-500 text-white font-bold py-3 rounded-lg text-lg hover:bg-teal-600 dark:bg-[#34D399] dark:text-[#0D1117] dark:hover:bg-[#2cb985]">
                <a href="/sign-up">Sign Up</a>
              </Button>
              <Button asChild variant="outline" className="w-full border-2 border-teal-500 text-teal-500 font-bold py-3 rounded-lg text-lg hover:bg-teal-500 hover:text-white dark:border-[#34D399] dark:text-white dark:hover:bg-[#34D399] dark:hover:text-[#0D1117]">
                <a href="/sign-in">Log In</a>
              </Button>
            </footer>

            <footer className="hidden md:block text-center">
                <Button asChild className="bg-teal-500 text-white font-bold rounded-lg text-lg h-14 px-10 hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 dark:bg-[#34D399] dark:text-[#0D1117] dark:hover:bg-[#2cb985]">
                  <a href="/sign-up">Get Started</a>
                </Button>
            </footer>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
