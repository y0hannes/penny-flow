export type ExpenseType = 'expense' | 'income';

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: ExpenseType;
  icon: string;
  note?: string;
  account?: string;
}

export interface Category {
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
