import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, Text, View, Alert, SafeAreaView } from 'react-native';
import { GetToken, GetUserId } from '../../../JwtTokens/JwtStorege';
import { useWebSocket } from '@/WebSoket/WSConnection';

export default function ChatWithUser({ route, navigation }) {
    const socket = useWebSocket();
    const { title } = route.params;
    const [messages, setMessages] = useState([]);
    const [UserId, setUserId] = useState(null);

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
                console.log("From server", response.data);
                setMessages(response.data);
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

    useEffect(() => {
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

    useEffect(() => {
        console.log("Messages updated:", messages);
    }, [messages]);

    return (
            <FlatList
                data={messages}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderMessage}
                style={styles.chatContainer}
            />
    );
}

const styles = StyleSheet.create({
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
        backgroundColor: '#DCF8C6', // Цвет для сообщений пользователя
    },
    partnerMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E4E6EB', // Цвет для сообщений собеседника
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
});
