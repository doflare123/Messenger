import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, Text, View, Alert, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { GetToken, GetUserId } from '../../../JwtTokens/JwtStorege';
import { useWebSocket } from '@/WebSoket/WSConnection';

export default function ChatWithUser({ route, navigation }) {
    const socket = useWebSocket();
    const { title } = route.params;
    const [messages, setMessages] = useState([]);
    const [UserId, setUserId] = useState(null);
    const [messageText, setMessageText] = useState(''); // Добавляем состояние для текста сообщения

    useEffect(() => {
        navigation.setOptions({ title });
    }, [navigation, title]);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await GetUserId();
            setUserId(id);
        };

        fetchUserId();
    }, []);

    const handleMessage = useCallback(async (event) => {
        try {
            const response = JSON.parse(event.data);
            if (response.success) {
                setMessages((prevMessages) => [...prevMessages, ...response.data]);
            } else {
                Alert.alert('Ошибка', response.message);
            }
        } catch (error) {
            console.error('Ошибка при обработке сообщения:', error, event.data);
        }
    }, []);

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

    const renderMessage = ({ item }) => {
        if (!UserId) return null;

        const isMyMessage = item.sender === UserId;
        return (
            <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.partnerMessage]}>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.messageTime}>{item.time}</Text>
            </View>
        );
    };

    const sendMessage = async () => {
        const JwtToken = await GetToken();
        const UserId = await GetUserId();
        if (messageText.trim() === '') return;

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

        const message = {
            type: 'NewMessage',
            JwtToken: JwtToken,
            text: messageText,
            sender: UserId,
            recipient: title,
            DataTime: currentTime
        };

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
            setMessageText('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={messages}
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
});