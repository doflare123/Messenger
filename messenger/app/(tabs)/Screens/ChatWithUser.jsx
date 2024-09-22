import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, FlatList, Text, View, Alert, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { GetToken, GetUserId, GetUserName } from '../../../JwtTokens/JwtStorege';
import { useWebSocket } from '@/WebSoket/WSConnection';

export default function ChatWithUser({ route, navigation }) {
    const socket = useWebSocket();
    const { title } = route.params;
    const [messages, setMessages] = useState([]);
    const [UserId, setUserId] = useState(null);
    const [NameUser, setNameUser] = useState(null);
    const [messageText, setMessageText] = useState('');
    const flatListRef = useRef(null); // Создание рефа для FlatList

    useEffect(() => {
        navigation.setOptions({ title });
    }, [navigation, title]);

    useEffect(() => {
        const fetchUserId = async () => {
            const name = await GetUserName();
            const id = await GetUserId();
            setUserId(id);
            setNameUser(name);
        };

        fetchUserId();
    }, []);

    const handleMessage = useCallback(async (event) => {
        try {
            const response = JSON.parse(event.data);
            if (response.success) {
                if (response.type === 'NewMessage') {
                    // Добавляем новое сообщение в состояние
                    const newMessage = {
                        _id: Math.floor(Math.random() * 1000).toString(), // Убедитесь, что _id уникален
                        sender: response.data.sender,
                        text: response.data.text,
                        time: response.data.time,
                        data: response.data.data,
                    };
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                } else {
                    // Обработка других типов сообщений
                    const newMessages = response.data.map((msg) => ({
                        _id: msg._id,
                        sender: msg.sender,
                        text: msg.text,
                        time: msg.time,
                        data: msg.data,
                    }));
                    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
                }
            } else {
                Alert.alert('Ошибка', response.message);
            }
        } catch (error) {
            console.error('Ошибка при обработке сообщения:', error, event.data);
        }
    }, []);
    

    useEffect(() => {
        if (messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    useEffect(() => {
        if (socket && NameUser) {
            socket.send(JSON.stringify({ type: 'registerС', userId: NameUser }));
        }
    }, [socket, NameUser]);

    useEffect(() => {
        if (socket) {
            socket.addEventListener('message', handleMessage);
            return () => {
                socket.removeEventListener('message', handleMessage);
            };
        }
    }, [socket, handleMessage]);    

    const fetchMessages = async () => {
        const JwtToken = await GetToken();
        const UserId = await GetUserId();

        if (JwtToken && UserId) {
            const message = {
                type: 'AllMesseges',
                JwtToken: JwtToken,
                UserId: UserId,
                AponentName: title,
            };

            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message));
            }
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [socket, title]);

    const renderMessage = ({ item, index }) => {
        if (!UserId) return null;

        const isMyMessage = item.sender === UserId;
        const previousMessage = messages[index - 1];
        const showDateHeader = !previousMessage || previousMessage.data !== item.data;

        return (
            <>
                {showDateHeader && (
                    <View style={styles.dateHeader}>
                        <Text style={styles.dateText}>{new Date(item.data).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long'
                        })}</Text>
                    </View>
                )}
                <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.partnerMessage]}>
                    <Text style={styles.messageText}>{item.text}</Text>
                    <Text style={styles.messageTime}>{item.time.slice(0, 5)}</Text>
                </View>
            </>
        );
    };

    const sendMessage = async () => {
        const JwtToken = await GetToken();
        const UserId = await GetUserId();
        if (messageText.trim() === '') return;
    
        const currentDate = new Date().toLocaleDateString('en-CA');
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    
        if (JwtToken && UserId) {
            const message = {
                type: 'NewMessage',
                JwtToken: JwtToken,
                text: messageText,
                sender: UserId,
                recipient: title, // имя оппонента
                DataTime: currentTime,
                Data: currentDate,
            };
    
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message));
    
                // Создаем новый объект сообщения для добавления в состояние
                const newMessage = {
                    _id: Math.floor(Math.random() * 1000).toString(), // Убедитесь, что это значение уникально
                    sender: UserId,
                    text: messageText,
                    time: currentTime,
                    data: currentDate,
                };
    
                // Обновляем состояние сообщений
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setMessageText('');
                flatListRef.current.scrollToEnd({ animated: true });
            }
        }
    };
    

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={flatListRef} // Присоединяем реф
                data={messages.sort((a, b) => new Date(a.data + ' ' + a.time) - new Date(b.data + ' ' + b.time))}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderMessage}
                style={styles.chatContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={messageText}
                    onChangeText={setMessageText}
                    placeholder="Введите ваше сообщение..."
                    onSubmitEditing={sendMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Отправить</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messageContainer: {
        marginVertical: 5,
        maxWidth: '70%',
        padding: 10,
        borderRadius: 10,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    partnerMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E4E6EB',
    },
    messageText: {
        fontSize: 16,
        color: '#000',
    },
    messageTime: {
        fontSize: 12,
        color: '#555',
        marginTop: 5,
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#007BFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    sendButtonText: {
        color: '#fff',
    },
    dateHeader: {
        alignSelf: 'center',
        marginVertical: 10,
    },
    dateText: {
        fontSize: 14,
        color: '#666',
    },
});
