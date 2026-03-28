export type ExpenseType = 'expense' | 'income';

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  rawDate?: string; // ISO date string from DB for reliable filtering
  type: ExpenseType;
  icon: string;
  note?: string;
  account?: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  type: ExpenseType;
  color?: string;
}

export interface CategorySummary {
  id: string;
  label: string;
  amount: number;
  icon: string;
}

export type CurrencyCode = 'ETB' | 'USD' | 'GBP' | 'EUR';

export interface Currency {
  code: CurrencyCode;
  label: string;
  symbol: string;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  color: string;
  icon: string;
  isPrimary: boolean;
}
