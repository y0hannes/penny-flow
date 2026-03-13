import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTabBar from '@/components/ui/BottomTabBar';
import HomeScreen from '@/screens/Home/HomeScreen';
import InsightsScreen from '@/screens/Insights/InsightsScreen';
import SettingsScreen from '@/screens/Settings/SettingsScreen';
import ProfileScreen from '@/screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNaviagtor() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Analytics" component={InsightsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}