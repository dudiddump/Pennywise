"use client";

import React, { useState, useEffect } from 'react';
import { BarChart2, DollarSign, Home, LineChart, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const BottomNavbar = () => {
    const pathname = usePathname();

    const navItems = [
        { href: "/main/my-expenses", icon: BarChart2, label: "Expenses" },
        { href: "/main/my-budget", icon: DollarSign, label: "Budget" },
        { href: "/dashboard", icon: Home, label: "Home" },
        { href: "/main/my-investment", icon: LineChart, label: "Investment" },
        { href: "/main/my-ai-chat", icon: MessageSquare, label: "Chat AI" },
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F2334] border-t border-white/10 px-1 lg:hidden">
            <div className="relative flex justify-around items-end h-14">
                {navItems.map((item, index) => {
                    const isActive = (item.href === '/dashboard' && pathname === item.href) || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    return (
                        <Link
                            href={item.href}
                            key={item.href}
                            className="flex flex-col items-center justify-end w-1/5 h-full"
                        >
                            <div className={cn(
                                "flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ease-out",
                                isActive
                                    ? "bg-teal-500 shadow-lg shadow-teal-500/50 -translate-y-6"
                                    : "bg-transparent"
                            )}>
                                <item.icon size={24} className={cn(isActive ? "text-white" : "text-gray-400")} />
                            </div>
                            
                            <span className={cn(
                                "text-xs text-gray-400 transition-opacity duration-200",
                                isActive ? "opacity-0" : "opacity-100"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </footer>
    );
};

export default BottomNavbar;
