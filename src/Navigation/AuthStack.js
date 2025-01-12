import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../LoginSignupScreen/LoginScreen';
import SignupScreen from '../LoginSignupScreen/SignupScreen';
import HomeScreen from '../MainScreens/HomeScreen';
import UserCartScreen from '../MainScreens/UserCartScreen';
import ProductScreen from '../MainScreens/ProductScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator  initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
                <Stack.Screen name="SignUp" component={SignupScreen} options={{headerShown: false}}/>
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
                <Stack.Screen name="UserCartScreen" component={UserCartScreen} options={{headerShown: false}}/>
                <Stack.Screen name="ProductScreen" component={ProductScreen} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AuthStack;