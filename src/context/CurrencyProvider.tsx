"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Currency = 'USD' | 'IDR' | 'MYR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  
  // Load currency from localStorage if available
  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency') as Currency;
    if (savedCurrency && ['USD', 'IDR', 'MYR'].includes(savedCurrency)) {
      setCurrency(savedCurrency);
    }
  }, []);
  
  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);
  
  const formatCurrency = (amount: number): string => {
    switch (currency) {
      case 'USD':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
      case 'IDR':
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
      case 'MYR':
        return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(amount);
      default:
        return `$${amount.toFixed(2)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};