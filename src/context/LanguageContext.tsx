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
    helpCenter: 'Help Center',
    privacyPolicy: 'Privacy Policy',
    logout: 'Logout',
    selectCurrency: 'Select Currency',
    selectLanguage: 'Select Language',
    totalWealth: 'TOTAL WEALTH',
    walletsActive: 'Wallets Active',

    // Home Screen (examples)
    totalBalance: 'Total Balance',
    recentTransactions: 'Recent Transactions',
    viewAll: 'View All',
  },
  am: {
    // Shared
    cancel: 'ሰርዝ',
    save: 'አስቀምጥ',
    active: 'ገባሪ',
    
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
    helpCenter: 'የእገዛ ማዕከል',
    privacyPolicy: 'የግላዊነት ፖሊሲ',
    logout: 'ውጣ',
    selectCurrency: 'ገንዘብ ይምረጡ',
    selectLanguage: 'ቋንቋ ይምረጡ',
    totalWealth: 'ጠቅላላ ሀብት',
    walletsActive: 'ገባሪ ቦርሳዎች',

    // Home Screen (examples)
    totalBalance: 'ጠቅላላ ቀሪ ሂሳብ',
    recentTransactions: 'የቅርብ ጊዜ ግብይቶች',
    viewAll: 'ሁሉንም ይመልከቱ',
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
