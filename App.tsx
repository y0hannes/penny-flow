import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '@/navigation/RootNavigator';
import { ExpenseProvider } from '@/context/ExpenseContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ExpenseProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ExpenseProvider>
    </SafeAreaProvider>
  );
}
