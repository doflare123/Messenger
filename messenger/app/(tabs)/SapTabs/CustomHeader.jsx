import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import { useWebSocket } from '@/WebSoket/WSConnection';
import { GetToken } from '../../../JwtTokens/JwtStorege';

const CustomHeader = ({ route, navigation }) => {
    const [inputValue, setInputValue] = useState(''); // Введенные данные
    const [users, setUsers] = useState([]); // Результаты поиска пользователей
    const [showResults, setShowResults] = useState(false); // Флаг для отображения результатов поиска
    const socket = useWebSocket();

    // Функция для поиска пользователей
    const handleSearch = async () => {
        if (!inputValue.trim()) {
            // Если поле пустое, ничего не делаем
            return;
        }
        try {
            const JwtToken = await GetToken();
            const message = {
                type: 'SearchUser',
                JwtToken: JwtToken,
                searchQuery: inputValue,
            };
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message));
            } else {
                console.error('WebSocket not open');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Отправка запроса при изменении inputValue с задержкой
    useEffect(() => {
        const timerId = setTimeout(() => {
            handleSearch(); // Выполнить поиск через 500 мс после ввода
        }, 500);

        // Очищаем таймер при каждом новом вводе
        return () => clearTimeout(timerId);
    }, [inputValue]);

    // Обработка входящих сообщений от WebSocket
    useEffect(() => {
        if (!inputValue.trim()) {
            // Если поле пустое, ничего не делаем
            return;
        }
        const handleMessage = (event) => {
            const response = JSON.parse(event.data);

            if (response.success && response.data) {
                setUsers(response.data);
                setShowResults(true); // Показываем результаты при получении данных
            }
        };

        if (socket) {
            socket.addEventListener('message', handleMessage);
            return () => {
                socket.removeEventListener('message', handleMessage);
            };
        }
    }, [socket]);

    // Автоматическое скрытие плашки с результатами через 10 секунд
    useEffect(() => {
        if (showResults) {
            const hideResultsTimeout = setTimeout(() => {
                setShowResults(false);
            }, 10000); // Скрываем через 10 секунд

            return () => clearTimeout(hideResultsTimeout); // Чистим таймер при обновлении
        }
    }, [showResults]);

    // Скрытие результатов при фокусе на текстовом инпуте
    const handleFocus = () => {
        setShowResults(false); // Скрываем плашку при фокусе на инпуте
    };

    // Функция для рендеринга каждого элемента списка пользователей
    const renderUserItem = ({ item }) => (
        <TouchableOpacity onPress={() => ClickInSearch(item.username)} style={styles.chatItem}>
            <View style={styles.userItem}>
                <Text>{item.username}</Text>
            </View>
        </TouchableOpacity>
    );

    const ClickInSearch = (username) => {
        if (!inputValue.trim()) {
            // Если поле пустое, ничего не делаем
            return;
        }
        setInputValue('');
        navigation.navigate("Chat", { title: username });
    }

    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Диалоги</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="🔍 Поиск..."
                    value={inputValue}
                    onChangeText={setInputValue}
                    onFocus={handleFocus} // Скрываем плашку при фокусе на инпуте
                />
            </View>
            {showResults && users.length > 0 && (
                <View style={styles.resultsContainer}>
                    <FlatList
                        data={users}
                        keyExtractor={(item, index) => item.username + index}
                        renderItem={renderUserItem}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        paddingHorizontal: 15,
        position: 'relative',
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    searchContainer: {
        marginLeft: 15,
        marginTop: 7,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: 200,
        height: 35,
        backgroundColor: 'white',
        paddingLeft: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'gray',
        marginRight: 10,
    },
    resultsContainer: {
        position: 'absolute',
        top: 50, // Расположите результаты поиска ниже заголовка
        right: 15,
        width: 200,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'gray',
        maxHeight: 200,
        elevation: 3,
    },
    userItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default CustomHeader;
