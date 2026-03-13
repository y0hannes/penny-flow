import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import AddExpenseScreen from '@/screens/AddExpense/AddExpenseScreen';
import AllCategoriesScreen from '@/screens/Insights/AllCategoriesScreen';

export type RootStackParamList = {
  Main: undefined;
  AddExpense: undefined;
  AllCategories: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
    </Stack.Navigator>
  );
}
