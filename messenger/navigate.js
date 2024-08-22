import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './app/(tabs)/Screens/LoginMenu';
import RegisterScreen from './app/(tabs)/Screens/RegisterMenu';
import MainScreen from './app/(tabs)/Screens/MainMenu';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function Navigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Authorization"
                component={LoginScreen}
                options={{ 
                    title: "Вход в аккаунт",
                    headerStyle: { //шапка
                        height: 80, 
                        backgroundColor: "#0011",
                    },
                    headerTitleContainerStyle: {//положение текста взависимости от объектов
                        marginTop: -25,
                    },
                    headerTitleStyle:{//стили текста
                        fontSize:30
                    },
                    headerTitleAlign: 'center'
                }}
            />
            <Stack.Screen
                name="Registration"
                component={RegisterScreen}
                options={{ title: "Регистрация аккаунта",
                    headerStyle: { //шапка
                        height: 80, 
                        backgroundColor: "#0011",
                    },
                    headerTitleContainerStyle: {//положение текста взависимости от объектов
                        marginTop: -30,
                    },
                    headerTitleStyle:{//стили текста
                        fontSize:30
                    },
                    headerTitleAlign: 'center',                
                }
                    
                }
            />
            <Stack.Screen
                name="MainMenu"
                component={MainScreen}
                options={{ title: "Диалоги" }}
            />
        </Stack.Navigator>
    );
}
