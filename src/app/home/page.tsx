"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { Banknote, Wallet, ShieldCheck, BarChart2, PiggyBank, FileText } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility for classnames

// --- Reusable Feature Card Component ---
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex-shrink-0 w-full bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg">
    <div className="bg-white/10 text-[#34D399] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

const LandingPage = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Updated array with all 6 features
  const features = [
    {
      icon: <Wallet size={24} />,
      title: "Expense Tracking",
      description: "Easily monitor your spending and categorize transactions to see where your money goes.",
    },
    {
      icon: <Banknote size={24} />,
      title: "Smart Budgeting",
      description: "Create and manage budgets with intelligent categorization and real-time tracking.",
    },
    {
      icon: <PiggyBank size={24} />,
      title: "Savings Goals",
      description: "Set and track your savings goals to achieve your financial dreams faster.",
    },
    {
      icon: <BarChart2 size={24} />,
      title: "Investment Insights",
      description: "Track your investments and get AI-driven insights to grow your portfolio.",
    },
    {
      icon: <FileText size={24} />,
      title: "Financial Reports",
      description: "Generate detailed financial reports to get a clear overview of your financial health.",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Secure & Private",
      description: "Your financial data is encrypted and protected with bank-level security.",
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === features.length - 1 ? 0 : prevIndex + 1));
  }, [features.length]);

  // Optional: Auto-play functionality
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  return (
    <div className="relative min-h-screen w-full bg-[#091C2D] text-white flex flex-col font-poppins overflow-hidden">
      {/* Background radial gradient effects */}
      <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-[radial-gradient(circle_at_center,_rgba(22,163,74,0.15)_0%,_transparent_70%)] -z-0"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.1)_0%,_transparent_70%)] -z-0"></div>

      <div className="relative z-10 flex flex-col flex-grow items-center justify-between p-6">
        
        <main className="flex flex-col items-center text-center w-full mt-16 sm:mt-24">
          <h1 className="text-2xl font-bold tracking-widest text-gray-300 mb-8">PURSE</h1>
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            <span className="text-gray-100">Smart Money</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Smarter You.
            </span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-gray-400 max-w-sm mx-auto">
            Take control of your financial well-being with our comprehensive platform.
          </p>
        </main>

        {/* Features Carousel Section */}
        <div className="w-full max-w-xs sm:max-w-sm mt-12 relative">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {features.map((feature, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          </div>
          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  currentIndex === index ? "bg-white" : "bg-white/30"
                )}
              />
            ))}
          </div>
        </div>

        <footer className="w-full max-w-md mx-auto text-center mt-12 space-y-4">
          <button 
            onClick={() => router.push('/sign-up')}
            className="w-full bg-[#34D399] text-[#0D1117] font-bold py-3 rounded-lg text-lg hover:bg-[#2cb985] transition-all duration-300 transform hover:scale-105"
          >
            Sign Up
          </button>
          <button 
            onClick={() => router.push('/sign-in')}
            className="w-full border-2 border-[#34D399] text-white font-bold py-3 rounded-lg text-lg hover:bg-[#34D399] hover:text-[#0D1117] transition-all duration-300 transform hover:scale-105"
          >
            Log In
          </button>
          <div className="pt-6 flex justify-center">
            <Image 
              src="/pennywise-logo.png" 
              alt="Pennywise Logo"
              width={40}
              height={40}
            />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
