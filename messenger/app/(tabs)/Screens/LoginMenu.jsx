import React, { useRef, useCallback } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import { useWebSocket } from '@/WebSoket/WSConnection';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    const socket = useWebSocket();
    const formikRef = useRef();

    const RegisterScreenCr = () => {
        navigation.navigate("Registration");
    }

    const handleMessage = useCallback(async (event) => {
        try {
            const response = JSON.parse(event.data);
            if (response.success) {
                if (response.token && response.id) {  // Проверяем наличие token и id
                    try {
                        await AsyncStorage.setItem('JwtToken', response.token);
                        await AsyncStorage.setItem('_id', response.id);
                        Alert.alert("Успешно", response.message);
                        navigation.replace("MainMenu");
                    } catch (error) {
                        console.log(error);
                        Alert.alert("Не сохранило данные.");
                    }
                } else {
                    console.log("Возможно баг");
                }
            } else {
                Alert.alert("Ошибка", response.message);
                if (response.message === "неверный логин или пароль" && formikRef.current) {
                    formikRef.current.setFieldValue('password', ''); // Очищаем поле пароля
                }
            }
        } catch (e) {
            console.error('Ошибка при разборе сообщения:', e, event.data);
        }
    }, [navigation]);    

    React.useEffect(() => {
        if (socket) {
            socket.addEventListener('message', handleMessage);
            return () => {
                socket.removeEventListener('message', handleMessage);
            };
        }
    }, [socket, handleMessage]);

    return (
        <SafeAreaView style={styles.container}>
            <Formik
                innerRef={formikRef}
                initialValues={{ type: 'login', email: '', password: '' }}
                onSubmit={async (values) => {
                    if (socket && socket.readyState === WebSocket.OPEN) {
                        const message = JSON.stringify(values);
                        socket.send(message);
                    }
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <>
                        <TextInput
                            style={styles.inputTextInput}
                            value={values.email}
                            placeholder="Введите почту"
                            keyboardType="email-address"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                        />
                        <TextInput
                            style={styles.inputTextInput}
                            value={values.password}
                            secureTextEntry={true}
                            placeholder="Введите пароль"
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                        />
                        <TouchableOpacity style={styles.textReg} onPress={RegisterScreenCr}>
                            <Text>Еще нет аккаунта?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text>Войти</Text>
                        </TouchableOpacity>
                    </>
                )}
            </Formik>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 200,
        paddingLeft: 75,
        paddingRight: 75,
    },
    inputTextInput: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        paddingTop: 4,
        marginTop: 7,
        marginLeft: 95,
        marginRight: 85,
        width: 70,
        height: 30,
        backgroundColor: "#1e90ff",
        alignItems: 'center'
    },
    textReg: {
        paddingLeft: 128,
        marginTop: -10
    }
});
