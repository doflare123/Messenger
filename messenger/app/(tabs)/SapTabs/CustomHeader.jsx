import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import { useWebSocket } from '@/WebSoket/WSConnection';
import { GetToken } from '../../../JwtTokens/JwtStorege';

const CustomHeader = ({ route, navigation }) => {
    const [inputValue, setInputValue] = useState(''); //введенные данные
    const [users, setUsers] = useState([]); //рез поиска пользователей
    const socket = useWebSocket();

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

    const handleSubmitEditing = () => {
        handleSearch();
    };

    // Обработка входящих сообщений от WebSocket
    useEffect(() => {
        const handleMessage = (event) => {
            const response = JSON.parse(event.data);
            
            if (response.success && response.data) {
                setUsers(response.data);
            }
        };

        if (socket) {
            socket.addEventListener('message', handleMessage);
            return () => {
                socket.removeEventListener('message', handleMessage);
            };
        }
    }, [socket]);
    useEffect(() => {
        if (!inputValue.trim()) {
            // Если поле пустое, ничего не делаем
            return;
        }
        const handleMessage = (event) => {
            const response = JSON.parse(event.data);
            console.log(response.data, 123)
            if (response.success && response.data) {
                setUsers(response.data);
            }
        };
    
        if (socket) {
            socket.addEventListener('message', handleMessage);
        }
    
        // Очистка при размонтировании компонента
        return () => {
            if (socket) {
                socket.removeEventListener('message', handleMessage);
            }
            setUsers([]);  // Очищаем результаты поиска при уходе с экрана
        };
    }, [socket]);
    

    // Функция для рендеринга каждого элемента списка пользователей
    const renderUserItem = ({ item }) => (
        <TouchableOpacity onPress={() => ClickInSearch(item.username)} style={styles.chatItem}>
            <View style={styles.userItem}>
                <Text>{item.username}</Text>
            </View>
        </TouchableOpacity>
    );

    const ClickInSearch = (username) => {
        setInputValue('');
        console.log(username)
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
                    onSubmitEditing={handleSubmitEditing}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>🔍</Text>
                </TouchableOpacity>
            </View>
                {users.length > 0 && (
                    <View style={styles.resultsContainer}>
                        <FlatList
                            data={users}
                            keyExtractor={(item) => item.username}
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
    searchButton: {
        backgroundColor: 'lightgray',
        borderRadius: 15,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        fontSize: 20,
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
