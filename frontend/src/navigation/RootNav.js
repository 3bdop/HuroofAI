import { StyleSheet, } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from '../screens/Home';
import Login from '../screens/Login';
import Letter from '../screens/Letter';
import Analytics from '../screens/Analytics';

const Stack = createNativeStackNavigator();

const RootNav = () => {
    return (
        <NavigationContainer>

            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='Letter' component={Letter} />
                <Stack.Screen name='Analytics' component={Analytics} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootNav
