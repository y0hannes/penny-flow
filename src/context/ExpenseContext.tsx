import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Expense, Currency, CurrencyCode } from '@/types/expense';

export const currencies: Currency[] = [
  { code: 'ETB', label: 'Birr', symbol: 'Br' },
  { code: 'USD', label: 'Dollar', symbol: '$' },
  { code: 'GBP', label: 'Pound', symbol: '£' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
];

interface ExpenseContextType {
  expenses: Expense[];
  currency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Mock data
// Mock data spanning across months and years
const initialExpenses: Expense[] = [
  // MARCH 2026 (Current Month)
  {
    id: '1',
    title: 'Starbucks Coffee',
    category: 'Food',
    amount: 5.4,
    date: 'Today, 09:45 AM',
    type: 'expense',
    icon: 'cafe',
    note: 'Morning coffee',
    account: 'Primary Wallet',
  },
  {
    id: '2',
    title: 'Uber Trip',
    category: 'Transport',
    amount: 12.5,
    date: 'Yesterday, 08:20 PM',
    type: 'expense',
    icon: 'car',
    note: 'Trip to downtown',
    account: 'Primary Wallet',
  },
  {
    id: 'm1',
    title: 'Rent Payment',
    category: 'Housing',
    amount: 1700.0,
    date: 'Mar 01, 2026',
    type: 'expense',
    icon: 'home',
    account: 'Bank Account',
  },
  {
    id: 'm2',
    title: 'Salary Deposit',
    category: 'Income',
    amount: 4500.0,
    date: 'Mar 01, 2026',
    type: 'income',
    icon: 'wallet',
    account: 'Bank Account',
  },
  {
    id: 'm3',
    title: 'Grocery Store',
    category: 'Food',
    amount: 156.40,
    date: 'Mar 05, 2026',
    type: 'expense',
    icon: 'basket',
    account: 'Primary Wallet',
  },
  {
    id: 'm4',
    title: 'Electricity Bill',
    category: 'Bills',
    amount: 85.20,
    date: 'Mar 10, 2026',
    type: 'expense',
    icon: 'flash',
    account: 'Bank Account',
  },

  // FEBRUARY 2026
  {
    id: 'f1',
    title: 'Freelance Work',
    category: 'Income',
    amount: 850.0,
    date: 'Feb 15, 2026',
    type: 'income',
    icon: 'cash',
    account: 'Primary Wallet',
  },
  {
    id: 'f2',
    title: 'Gym Membership',
    category: 'Health',
    amount: 50.0,
    date: 'Feb 01, 2026',
    type: 'expense',
    icon: 'fitness',
    account: 'Bank Account',
  },
  {
    id: 'f3',
    title: 'New Shoes',
    category: 'Shopping',
    amount: 120.0,
    date: 'Feb 20, 2026',
    type: 'expense',
    icon: 'cart',
    account: 'Primary Wallet',
  },

  // JANUARY 2026
  {
    id: 'j1',
    title: 'New Year Party',
    category: 'Entertainment',
    amount: 200.0,
    date: 'Jan 01, 2026',
    type: 'expense',
    icon: 'wine',
    account: 'Primary Wallet',
  },
  {
    id: 'j2',
    title: 'Flight Tickets',
    category: 'Transport',
    amount: 450.0,
    date: 'Jan 10, 2026',
    type: 'expense',
    icon: 'airplane',
    account: 'Bank Account',
  },

  // DECEMBER 2025
  {
    id: 'd1',
    title: 'Christmas Gifts',
    category: 'Shopping',
    amount: 500.0,
    date: 'Dec 24, 2025',
    type: 'expense',
    icon: 'gift',
    account: 'Primary Wallet',
  },
  {
    id: 'd2',
    title: 'End of Year Bonus',
    category: 'Income',
    amount: 2000.0,
    date: 'Dec 15, 2025',
    type: 'income',
    icon: 'trending-up',
    account: 'Bank Account',
  },

  // NOVEMBER 2025
  {
    id: 'n1',
    title: 'Thanksgiving Dinner',
    category: 'Food',
    amount: 150.0,
    date: 'Nov 25, 2025',
    type: 'expense',
    icon: 'restaurant',
    account: 'Primary Wallet',
  },
];

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [currency, setCurrencyState] = useState<Currency>(currencies[1]); // Default to USD

  const setCurrency = (code: CurrencyCode) => {
    const newCurrency = currencies.find((c) => c.code === code);
    if (newCurrency) {
      setCurrencyState(newCurrency);
    }
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(), // Simple ID generation
    };
    setExpenses((prev) => [newExpense, ...prev]); // Add to beginning of array
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const updateExpense = (id: string, updatedData: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, ...updatedData } : expense
      )
    );
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        currency,
        setCurrency,
        addExpense,
        deleteExpense,
        updateExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
