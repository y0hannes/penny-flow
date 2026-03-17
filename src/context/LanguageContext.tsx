import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LanguageType = 'en' | 'am';

type Translations = {
  [key in LanguageType]: {
    [key: string]: string;
  };
};

export const translations: Translations = {
  en: {
    // Shared
    cancel: 'Cancel',
    save: 'Save',
    active: 'Active',
    delete: 'Delete',
    error: 'Error',
    
    // Bottom Tab
    home: 'Home',
    analytics: 'Analytics',
    profile: 'Profile',
    
    // Profile Screen
    myFinances: 'My Finances',
    manageWallets: 'Manage Wallets',
    paymentMethods: 'Payment Methods',
    financialReports: 'Financial Reports',
    appSettings: 'App Settings',
    currency: 'Currency',
    language: 'Language',
    darkMode: 'Dark Mode',
    pushNotifications: 'Push Notifications',
    account: 'Account',
    personalInformation: 'Personal Information',
    email: 'Email',
    fullName: 'Full Name',
    updateProfile: 'Update Profile',
    success: 'Success',
    profileUpdated: 'Profile updated successfully',
    errorUpdatingProfile: 'Error updating profile',
    helpCenter: 'Help Center',
    privacyPolicy: 'Privacy Policy',
    logout: 'Logout',
    selectCurrency: 'Select Currency',
    selectLanguage: 'Select Language',
    totalWealth: 'TOTAL WEALTH',
    walletsActive: 'Wallets Active',

    // Home Screen
    totalBalance: 'Total Balance',
    fromLastMonth: 'from last month',
    income: 'Income',
    expenses: 'Expenses',
    categories: 'Categories',
    seeAll: 'See All',
    recentTransactions: 'Recent Transactions',
    viewAll: 'View All',

    // Insights Screen
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    totalSpentThisMonth: 'Total spent this month',
    vsLastMonth: 'vs last month',
    dailyTrends: 'Daily Trends',
    details: 'Details',
    topCategories: 'Top Categories',
    transactions: 'Transactions',

    // Wallets Screen
    yourWallets: 'YOUR WALLETS',
    primary: 'PRIMARY',
    editWallet: 'Edit Wallet',
    newWallet: 'New Wallet',
    walletName: 'WALLET NAME',
    initialBalance: 'INITIAL BALANCE',
    themeColor: 'THEME COLOR',
    saveWallet: 'Save Wallet',
    pleaseEnterWalletName: 'Please enter a wallet name',
    cannotDelete: 'Cannot Delete',
    cannotDeletePrimary: 'You cannot delete the primary wallet. Set another wallet as primary first.',
    deleteWallet: 'Delete Wallet',
    deleteWalletWarning: 'Are you sure you want to delete this wallet? All history associated with this wallet name will remain but the wallet itself will be removed.',
  },
  am: {
    // Shared
    cancel: 'ሰርዝ',
    save: 'አስቀምጥ',
    active: 'ገባሪ',
    delete: 'መሰረዝ',
    error: 'ስህተት',
    
    // Bottom Tab
    home: 'መነሻ',
    analytics: 'ትምህርት',
    profile: 'ፕራይፌል', // መገለጫ
    
    // Profile Screen
    myFinances: 'የእኔ ፋይናንስ',
    manageWallets: 'ቦርሳዎችን አስተዳድር',
    paymentMethods: 'የክፍያ ዘዴዎች',
    financialReports: 'የፋይናንስ ሪፖርቶች',
    appSettings: 'የመተግበሪያ ቅንብሮች',
    currency: 'ገንዘብ',
    language: 'ቋንቋ',
    darkMode: 'ጨለማ ገጽታ',
    pushNotifications: 'ማሳወቂያዎች',
    account: 'መለያ',
    personalInformation: 'የግል መረጃ',
    email: 'ኢሜይል',
    fullName: 'ሙሉ ስም',
    updateProfile: 'መገለጫ አዘምን',
    success: 'ስኬት',
    profileUpdated: 'መገለጫው በተሳካ ሁኔታ ዘምኗል',
    errorUpdatingProfile: 'መገለጫን በማዘመን ላይ ስህተት ተፈጥሯል',
    helpCenter: 'የእገዛ ማዕከል',
    privacyPolicy: 'የግላዊነት ፖሊሲ',
    logout: 'ውጣ',
    selectCurrency: 'ገንዘብ ይምረጡ',
    selectLanguage: 'ቋንቋ ይምረጡ',
    totalWealth: 'ጠቅላላ ሀብት',
    walletsActive: 'ገባሪ ቦርሳዎች',

    // Home Screen
    totalBalance: 'ጠቅላላ ቀሪ ሂሳብ',
    fromLastMonth: 'ካለፈው ወር',
    income: 'ገቢ',
    expenses: 'ወጪዎች',
    categories: 'ምድቦች',
    seeAll: 'ሁሉንም ይመልከቱ',
    recentTransactions: 'የቅርብ ጊዜ ግብይቶች',
    viewAll: 'ሁሉንም ይመልከቱ',

    // Insights Screen
    weekly: 'ሳምንታዊ',
    monthly: 'ወርሃዊ',
    yearly: 'አመታዊ',
    totalSpentThisMonth: 'በዚህ ወር የጠፋው ጠቅላላ',
    vsLastMonth: 'ካለፈው ወር ጋር ሲነፃፀር',
    dailyTrends: 'ዕለታዊ አዝማሚያዎች',
    details: 'ዝርዝሮች',
    topCategories: 'ከፍተኛ ምድቦች',
    transactions: 'ግብይቶች',

    // Wallets Screen
    yourWallets: 'የእርስዎ ቦርሳዎች',
    primary: 'ዋና',
    editWallet: 'የቦርሳ ማስተካከያ',
    newWallet: 'አዲስ ቦርሳ',
    walletName: 'የቦርሳ ስም',
    initialBalance: 'የመጀመሪያ ቀሪ ሂሳብ',
    themeColor: 'የገጽታ ቀለም',
    saveWallet: 'ቦርሳ አስቀምጥ',
    pleaseEnterWalletName: 'እባክዎ የቦርሳ ስም ያስገቡ',
    cannotDelete: 'መሰረዝ አልተቻለም',
    cannotDeletePrimary: 'ዋናውን ቦርሳ መሰረዝ አይችሉም። መጀመሪያ ሌላ ቦርሳ እንደ ዋና ያዘጋጁ።',
    deleteWallet: 'ቦርሳ ሰርዝ',
    deleteWalletWarning: 'እርግጠኛ ነዎት ይህን ቦርሳ መሰረዝ ይፈልጋሉ? ከዚህ የቦርሳ ስም ጋር የተገናኙ ሁሉም ታሪኮች ይቀራሉ ነገር ግን ቦርሳው ራሱ ይወገዳል።',
  }
};

interface LanguageContextData {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextData>({} as LanguageContextData);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>('en');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('@language');
        if (storedLang === 'en' || storedLang === 'am') {
          setLanguageState(storedLang as LanguageType);
        }
      } catch (e) {
        console.error('Failed to load language', e);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: LanguageType) => {
    try {
      setLanguageState(lang);
      await AsyncStorage.setItem('@language', lang);
    } catch (e) {
      console.error('Failed to save language', e);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
