import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './app/(tabs)/Screens/LoginMenu';
import RegisterScreen from './app/(tabs)/Screens/RegisterMenu';
import MainScreen from './app/(tabs)/Screens/MainMenu';

const Stack = createStackNavigator();

export default function Navigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Authorization"
                component={LoginScreen}
                options={{ 
                    title: "Вход в аккаунт",
                    headerStyle: {
                        height: 80, // Задайте высоту шапки
                        backgroundColor: "#0011",
                    },
                    headerTitleContainerStyle: {
                        marginTop: -48,
                        fontSize: 200
                    },
                    headerTitleStyle:{
                        fontSize:30
                    },
                    headerTitleAlign: 'center'
                }}
            />
            <Stack.Screen
                name="Registration"
                component={RegisterScreen}
                options={{ title: "Регистрация аккаунта" }}
            />
            <Stack.Screen
                name="MainMenu"
                component={MainScreen}
                options={{ title: "Диалоги" }}
            />
        </Stack.Navigator>
    );
}
