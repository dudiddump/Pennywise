'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Currency = 'USD' | 'MYR' | 'IDR'

type CurrencyContextType = {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD')

  useEffect(() => {
    // Load currency from localStorage on initial load
    const savedCurrency = localStorage.getItem('currency') as Currency | null
    if (savedCurrency && ['USD', 'MYR', 'IDR'].includes(savedCurrency)) {
      setCurrency(savedCurrency)
    }
  }, [])

  useEffect(() => {
    // Save currency to localStorage whenever it changes
    localStorage.setItem('currency', currency)
  }, [currency])

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}