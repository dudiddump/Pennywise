"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { Banknote, Wallet, ShieldCheck, BarChart2, PiggyBank, FileText } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="relative h-full flex flex-col items-center text-center bg-[#0F2334] p-6 rounded-2xl border border-white/10 transition-shadow duration-300 shadow-[0_0_15px_rgba(52,211,153,0.2)] hover:shadow-[0_0_25px_rgba(52,211,153,0.4)]">
    <div className="bg-white/10 text-[#34D399] w-12 h-12 rounded-lg flex items-center justify-center mb-4 flex-shrink-0">
      {icon}
    </div>
    <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

const LandingPage = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <div className="relative min-h-screen w-full bg-[#091C2D] text-white flex flex-col font-poppins overflow-hidden">
      
      <div className="absolute top-[-25%] left-[-25%] w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_rgba(22,163,74,0.15)_0%,_transparent_75%)] -z-10"></div>
      <div className="absolute bottom-[-25%] right-[-25%] w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.1)_0%,_transparent_75%)] -z-10"></div>

      <div className="relative z-10 flex flex-col flex-grow items-center justify-center w-full max-w-6xl mx-auto p-6">
        
        <div className="flex-grow flex flex-col items-center justify-center w-full">
          <main className="flex flex-col items-center text-center w-full">
            <div className="flex items-center gap-3 mb-4">
                <Image src="/pennywise-logo.png" alt="Pennywise Logo" width={40} height={40} className="h-10 w-10 md:h-12 md:w-12" />
                <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-gray-200">Pennywise</h1>
            </div>

            <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight">
              <span className="text-gray-100">Smart Money, </span>
              <span className="block mt-1 md:inline md:mt-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Smarter You</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
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
                <button key={index} onClick={() => setCurrentIndex(index)} className={cn("w-2 h-2 rounded-full transition-colors", currentIndex === index ? "bg-white" : "bg-white/30")} />
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
              <Button asChild className="w-full bg-[#34D399] text-[#0D1117] font-bold py-3 rounded-lg text-lg hover:bg-[#2cb985]">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-2 border-[#34D399] text-white font-bold py-3 rounded-lg text-lg hover:bg-[#34D399] hover:text-[#0D1117]">
                <Link href="/sign-in">Log In</Link>
              </Button>
            </footer>

            <footer className="hidden md:block text-center">
                <Button asChild className="bg-[#34D399] text-[#0D1117] font-bold rounded-lg text-lg h-14 px-10 hover:bg-[#2cb985] transition-all duration-300 transform hover:scale-105">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
            </footer>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
