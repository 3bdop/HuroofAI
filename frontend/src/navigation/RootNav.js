import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from '../screens/Home';
import Letter from '../screens/Letter';
// import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();
// const HomeScreen = React.lazy(() => import('../screens/Home'))
// const LetterScreen = React.lazy(() => import('../screens/Letter'))

const RootNav = () => {
    return (
        <NavigationContainer>

            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='Letter' component={Letter} />
            </Stack.Navigator>

            {/* {isLoading ? <SplashScreen /> :
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Letter' component={Letter} />
      </Stack.Navigator>
    } */}
        </NavigationContainer>
    )
}

export default RootNav

const styles = StyleSheet.create({})
