import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Expense, Currency, CurrencyCode, Wallet } from '@/types/expense';
import { supabase } from '@/lib/supabase';

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
  wallets: Wallet[];
  addWallet: (wallet: Omit<Wallet, 'id'>) => void;
  updateWallet: (id: string, updatedData: Partial<Wallet>) => void;
  deleteWallet: (id: string) => void;
  setPrimaryWallet: (id: string) => void;
  primaryWallet: Wallet | undefined;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Initial data is now empty, will be fetched from Supabase
const initialWallets: Wallet[] = [];
const initialExpenses: Expense[] = [];

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [currency, setCurrencyState] = useState<Currency>(currencies[1]); // Default to USD
  const [wallets, setWallets] = useState<Wallet[]>(initialWallets);

  const primaryWallet = wallets.find(w => w.isPrimary) || wallets[0];

  useEffect(() => {
    fetchData();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchData();
      } else {
        // Clear data on logout
        setExpenses([]);
        setWallets([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch Wallets
    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .order('created_at', { ascending: true });

    if (!walletError && walletData) {
      setWallets(walletData.map(w => ({
        id: w.id,
        name: w.name,
        balance: parseFloat(w.balance),
        color: w.color,
        icon: w.icon,
        isPrimary: w.is_primary,
      })));
    }

    // Fetch Transactions
    const { data: transData, error: transError } = await supabase
      .from('transactions')
      .select(`
        *,
        wallets (name)
      `)
      .order('date', { ascending: false });

    if (!transError && transData) {
      setExpenses(transData.map(t => ({
        id: t.id,
        title: t.title,
        category: t.category,
        amount: parseFloat(t.amount),
        date: new Date(t.date).toLocaleDateString(), // Simple formatting
        type: t.type,
        icon: t.icon,
        note: t.note,
        account: t.wallets?.name || 'Unknown',
      })));
    }
  };

  const setCurrency = (code: CurrencyCode) => {
    const newCurrency = currencies.find((c) => c.code === code);
    if (newCurrency) {
      setCurrencyState(newCurrency);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const wallet = wallets.find(w => w.name === expense.account);
    if (!wallet) return;

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        title: expense.title,
        category: expense.category,
        amount: expense.amount,
        type: expense.type,
        icon: expense.icon,
        note: expense.note,
        date: new Date().toISOString(),
      })
      .select()
      .single();

    if (!error && data) {
      // Update local state
      setExpenses(prev => [{ ...expense, id: data.id }, ...prev]);
      
      // Update wallet balance in DB
      const balanceChange = expense.type === 'expense' ? -expense.amount : expense.amount;
      const newBalance = wallet.balance + balanceChange;
      
      await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('id', wallet.id);

      setWallets(prev => prev.map(w => w.id === wallet.id ? { ...w, balance: newBalance } : w));
    }
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (!error) {
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    }
  };

  const updateExpense = async (id: string, updatedData: Partial<Expense>) => {
    const { error } = await supabase
      .from('transactions')
      .update({
        title: updatedData.title,
        category: updatedData.category,
        amount: updatedData.amount,
        type: updatedData.type,
        icon: updatedData.icon,
        note: updatedData.note,
      })
      .eq('id', id);

    if (!error) {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === id ? { ...expense, ...updatedData } : expense
        )
      );
    }
  };

  const addWallet = async (wallet: Omit<Wallet, 'id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('wallets')
      .insert({
        user_id: user.id,
        name: wallet.name,
        balance: wallet.balance,
        color: wallet.color,
        icon: wallet.icon,
        is_primary: wallet.isPrimary,
      })
      .select()
      .single();

    if (!error && data) {
      const newWallet: Wallet = { ...wallet, id: data.id };
      if (wallet.isPrimary) {
        setWallets((prev) => prev.map(w => ({ ...w, isPrimary: false })).concat(newWallet));
      } else {
        setWallets((prev) => [...prev, newWallet]);
      }
    }
  };

  const updateWallet = async (id: string, updatedData: Partial<Wallet>) => {
    const { error } = await supabase
      .from('wallets')
      .update({
        name: updatedData.name,
        balance: updatedData.balance,
        color: updatedData.color,
        is_primary: updatedData.isPrimary,
      })
      .eq('id', id);

    if (!error) {
      setWallets((prev) => {
        let next = prev.map((w) => (w.id === id ? { ...w, ...updatedData } : w));
        if (updatedData.isPrimary) {
          next = next.map((w) => (w.id === id ? w : { ...w, isPrimary: false }));
        }
        return next;
      });
    }
  };

  const deleteWallet = async (id: string) => {
    const { error } = await supabase
      .from('wallets')
      .delete()
      .eq('id', id);

    if (!error) {
      setWallets((prev) => {
        const filtered = prev.filter((w) => w.id !== id);
        if (filtered.length > 0 && !filtered.find(w => w.isPrimary)) {
          filtered[0].isPrimary = true;
        }
        return filtered;
      });
    }
  };

  const setPrimaryWallet = async (id: string) => {
    // Update all wallets in DB (flip is_primary)
    // Supabase doesn't support batch update with logic easily in one call without a function
    // So we update the one we want to be primary, and others via application logic or another call
    
    const { error } = await supabase
      .from('wallets')
      .update({ is_primary: true })
      .eq('id', id);

    if (!error) {
      // Clear other primaries in DB
      await supabase
        .from('wallets')
        .update({ is_primary: false })
        .neq('id', id);

      setWallets((prev) =>
        prev.map((w) => ({
          ...w,
          isPrimary: w.id === id,
        }))
      );
    }
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
        wallets,
        addWallet,
        updateWallet,
        deleteWallet,
        setPrimaryWallet,
        primaryWallet,
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
