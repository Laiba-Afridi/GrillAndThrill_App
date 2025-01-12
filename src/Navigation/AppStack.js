import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../MainScreens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import UserCartScreen from '../MainScreens/UserCartScreen';
import TrackOrderScreen from '../MainScreens/TrackOrderScreen';
import AccountAndSettings from '../MainScreens/AccountAndSettings';
import LoginScreen from '../LoginSignupScreen/LoginScreen';
import SignUpScreen from '../LoginSignupScreen/SignupScreen'
import ProductScreen from '../MainScreens/ProductScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator initialRouteName="HomeScreen">
    <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AccountAndSettings" component={AccountAndSettings} />
    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
    <Stack.Screen name="UserCartScreen" component={UserCartScreen} options={{headerShown: false}}/>
  </Stack.Navigator>
);




const AppStack = () => {
  return (
    <NavigationContainer>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            }
            else if (route.name === 'Settings') {
              iconName = 'settings';
            }
            else if (route.name === 'Cart') {
              iconName = 'bag';
            }
            else if (route.name === 'Orders') {
              iconName = 'map';
            }
            return <Ionicons name={iconName} size={size} color={'#ffffe3'} />
          },
          tabBarLabelStyle: styles.tabBarLabel
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
        <Tab.Screen name="Cart" component={UserCartScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Orders" component={TrackOrderScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Settings" component={AccountAndSettings} options={{ headerShown: false }} />


      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppStack

const styles = StyleSheet.create({
  tabBar: {
    height: 55,
    backgroundColor: '#080f17',
    borderTopWidth: 1,
    borderColor: '#ffff00',
    color:'#ffffe3',
  },
  tabBarLabel: {
    paddingBottom: 5
  }
})