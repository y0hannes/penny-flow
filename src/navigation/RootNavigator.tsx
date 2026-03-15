import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import AddExpenseScreen from '@/screens/AddExpense/AddExpenseScreen';
import AllCategoriesScreen from '@/screens/Insights/AllCategoriesScreen';
import WalletsScreen from '@/screens/Settings/WalletsScreen';
import AuthScreen from '@/screens/Auth/AuthScreen';
import { useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  AddExpense: undefined;
  AllCategories: undefined;
  Wallets: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00D09C" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen
            name="AddExpense"
            component={AddExpenseScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen name="AllCategories" component={AllCategoriesScreen} />
          <Stack.Screen name="Wallets" component={WalletsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
