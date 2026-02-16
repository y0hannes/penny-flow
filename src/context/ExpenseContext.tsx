import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Expense } from '@/types/expense';

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Mock data
const initialExpenses: Expense[] = [
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
    id: '3',
    title: 'Freelance Payment',
    category: 'Income',
    amount: 850.0,
    date: 'Oct 24, 02:00 PM',
    type: 'income',
    icon: 'cash',
    note: 'Client project payment',
    account: 'Primary Wallet',
  },
  {
    id: '4',
    title: 'Whole Foods',
    category: 'Food',
    amount: 45.9,
    date: 'Oct 23, 11:30 AM',
    type: 'expense',
    icon: 'basket',
    note: 'Weekly groceries',
    account: 'Primary Wallet',
  },
  {
    id: '5',
    title: 'Amazon Shopping',
    category: 'Shopping',
    amount: 89.99,
    date: 'Oct 22, 03:15 PM',
    type: 'expense',
    icon: 'cart',
    note: 'Electronics accessories',
    account: 'Primary Wallet',
  },
  {
    id: '6',
    title: 'Netflix Subscription',
    category: 'Bills',
    amount: 15.99,
    date: 'Oct 20, 12:00 AM',
    type: 'expense',
    icon: 'receipt',
    note: 'Monthly subscription',
    account: 'Primary Wallet',
  },
];

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

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
      value={{ expenses, addExpense, deleteExpense, updateExpense }}
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
