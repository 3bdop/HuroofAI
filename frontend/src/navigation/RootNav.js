import { StyleSheet, } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from '../screens/Home';
import Letter from '../screens/Letter';

const Stack = createNativeStackNavigator();

const RootNav = () => {
    return (
        <NavigationContainer>

            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='Letter' component={Letter} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootNav
