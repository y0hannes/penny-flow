import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '@/navigation/RootNavigator';
import { AuthProvider } from '@/context/AuthContext';
import { ExpenseProvider } from '@/context/ExpenseContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <ExpenseProvider>
            <ThemeProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </ThemeProvider>
          </ExpenseProvider>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
