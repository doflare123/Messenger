import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import Constants from 'expo-constants';

const URL = Constants.expoConfig.extra.apiUrl;

export default function LoginScreen({ navigation }) {
    const [socket, setSocket] = useState(null);

    const RegisterScreenCr =()=>{
        navigation.navigate("Registration");
    }

    useEffect(() => {
        const ws = new WebSocket(URL);  // Подключение к WebSocket-серверу
        setSocket(ws);

        ws.onopen = () => {
            console.log("Соединение установлено");
        };

        ws.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                if (response.success) {
                    Alert.alert("Успешно", response.message);
                    // Навигация на следующий экран или другая логика при успешном входе
                } else {
                    Alert.alert("Ошибка", response.message);
                }
            } catch (e) {
                console.error('Ошибка при разборе сообщения:', e, event.data);
            }
        };
        

        ws.onclose = (event) => {
            console.log("WebSocket соединение закрыто:", event);
        };

        ws.onerror = (error) => {
            console.log("Ошибка WebSocket:", error);
        };

        return () => {
            ws.close(1000, "Компонент размонтирован, соединение закрыто");
        };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Formik
                initialValues={{type:'login', email: '', password: ''}}
                onSubmit={async values => {
                    if (socket && socket.readyState === WebSocket.OPEN) {
                        const message = JSON.stringify(values);  // Преобразуем данные формы в JSON-строку
                        socket.send(message);  // Отправляем данные на сервер
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
    touchableText: {
        color: "#458ed6",
        fontSize: 12,
        marginTop: -9,
        marginLeft: 96,
        width: 110
    },
    textReg: {
        paddingLeft: 128,
        marginTop: -10
    }
});
