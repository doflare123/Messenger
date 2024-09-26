import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import { createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './app/(tabs)/Screens/LoginMenu';
import RegisterScreen from './app/(tabs)/Screens/RegisterMenu';
import MainScreen from './app/(tabs)/Screens/MainMenu';
import ChatWitUser from './app/(tabs)/Screens/ChatWithUser';
import ProfileUser from './app/(tabs)/Screens/Profile';
import { WebSocketProvider } from './WebSoket/WSConnection';
import CustomHeader from './app/(tabs)/SapTabs/CustomHeader'; // Импортируйте CustomHeader
import { Ionicons } from '@expo/vector-icons';


const Stack = createStackNavigator();

export default function Navigator() {
    return (
        <WebSocketProvider>
            <Stack.Navigator>
                <Stack.Screen
                    name="Authorization"
                    component={LoginScreen}
                    options={{ 
                        title: "Вход в аккаунт",
                        headerStyle: { 
                            height: 80, 
                            backgroundColor: "#0011",
                        },
                        headerTitleContainerStyle: {
                            marginTop: -25,
                        },
                        headerTitleStyle: {
                            fontSize: 30,
                        },
                        headerTitleAlign: 'center',
                    }}
                />
                <Stack.Screen
                    name="Registration"
                    component={RegisterScreen}
                    options={{ 
                        title: "Регистрация аккаунта",
                        headerStyle: {
                            height: 100, 
                            backgroundColor: "#0011",
                        },
                        headerTitleContainerStyle: {
                            marginTop: -30,
                        },
                        headerTitleStyle: {
                            fontSize: 30,
                        },
                        headerTitleAlign: 'center',
                    }}
                />
                <Stack.Screen
                    name="MainMenu"
                    component={MainScreen}
                    options={({ navigation }) => ({
                        headerTitle: () => <CustomHeader navigation={navigation} />, // Передаем navigation
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: "silver",
                        },
                        headerTitleContainerStyle: {
                            marginTop: -15,
                            marginLeft: 10,
                        },
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.navigate("ProfileUser")}>
                                <Text style={styles.but}>≡</Text>
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen
                    name="Chat"
                    component={ChatWitUser}
                    options={({ navigation }) => ({
                        title: "",
                        headerStyle: {
                            backgroundColor: "silver",
                        },
                        headerTitleContainerStyle: {
                            marginTop: -15,
                            marginLeft: 10,
                        },
                        headerTitleStyle: {
                            fontSize: 30,
                        },
                        headerLeft: () => (
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.backButton}
                            >
                                <Ionicons name="arrow-back" size={24} color="black" />
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen
                    name="ProfileUser"
                    component={ProfileUser}
                    options={() =>({
                        title:"Профиль",
                        headerStyle:{
                            backgroundColor:"silver"
                        },
                        headerTitleStyle: {
                            fontSize: 30,
                        },
                        headerTitleContainerStyle:{
                            marginTop: -13,
                            marginLeft: -7,
                        },
                        headerLeftContainerStyle:{
                            marginTop:-5
                        }
                    })}
                />
            </Stack.Navigator>
        </WebSocketProvider>
    );
}

const styles = StyleSheet.create({
    but: {
        marginLeft: 5,
        marginTop: -15,
        fontSize: 40,
    },
    backButton: {
        marginLeft: 10,
        marginTop: -10,
    },
});
