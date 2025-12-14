import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import ExpensesScreen from '../screens/ExpensesScreen/ExpensesScreen/ExpensesScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            initialRouteName="NetWorth"
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#E2E8F0',
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                tabBarActiveTintColor: '#3B82F6',
                tabBarInactiveTintColor: '#94A3B8',
            }}
        >
            <Tab.Screen
                name="NetWorth"
                component={DashboardScreen}
                options={{
                    tabBarLabel: 'Net Worth',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'wallet' : 'wallet-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Expenses"
                component={ExpensesScreen}
                options={{
                    tabBarLabel: 'Expenses',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'receipt' : 'receipt-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}