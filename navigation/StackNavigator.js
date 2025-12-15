import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SplashScreen from '../screens/SplashScreen/SplashScreen';
import CreateProfileScreen from '../screens/SignUp/CreateProfileScreen';
import FingerprintScreen from '../screens//FingerprintScreen/FingerprintScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import BottomTabs from './BottomTabs';
import ProfileScreen from '../screens/Dashboard/ProfileScreen/ProfileScreen'

import MutualFundScreen from '../screens/NetworthScreen/MutualFund/MutualFundScreen';
import AddMutualFundScreen from '../screens/NetworthScreen/MutualFund/AddMutualFundScreen';

import FixedDepositScreen from '../screens/NetworthScreen/FixedDeposit/FixedDepositScreen';
import AddFixedDepositScreen from '../screens/NetworthScreen/FixedDeposit/AddfixedDepositScreen';


const Stack = createNativeStackNavigator();


export default function StackNavigator() {
    return (
        <SafeAreaProvider>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
                    <Stack.Screen name="Fingerprint" component={FingerprintScreen} />

                    <Stack.Screen name="Dashboard" component={BottomTabs} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    <Stack.Screen name="MutualFund" component={MutualFundScreen} />
                    <Stack.Screen name="AddMutualFund" component={AddMutualFundScreen} />

                    <Stack.Screen name="FixedDeposit" component={FixedDepositScreen} />
                    <Stack.Screen name="AddfixedDeposit" component={AddFixedDepositScreen} />

                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}