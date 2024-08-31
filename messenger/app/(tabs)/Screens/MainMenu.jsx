import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Text, View, TouchableOpacity } from 'react-native';
import Head from '../HeadForm';
import { GetToken, GetUserId } from '../../../JwtTokens/JwtStorege';
import { useWebSocket } from '@/WebSoket/WSConnection';

export default function MainScreen() {
  const socket = useWebSocket();
  const [Chats, setChats] = useState([]);

  

  useEffect(() => {
    // Асинхронная функция для получения данных
    async function fetchChats() {
      try {
        const JwtToken = await GetToken();
        const UserId = await GetUserId();
        if (JwtToken && UserId) {
          const message = {
            type: 'Alldialogs',
            JwtToken: JwtToken,
            UserId: UserId,
          };

          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
          }
          
          socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.success) {
              setChats(response.data);
            } else {
              console.error('Ошибка получения диалогов:', response.message);
            }
          };
        }
      } catch (error) {
        console.error('Ошибка при получении диалогов:', error);
      }
    }

    // Вызов функции
    fetchChats();

    // Очистка WebSocket обработчиков при размонтировании компонента
    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socket]);

  const Sumbmit = async () => {
    
};

  return (
    <SafeAreaView style={styles.container}>
      <Head />
      <FlatList
        data={Chats}
        keyExtractor={(item) => item.partnerId}
        renderItem={({ item }) => (
          <View style={styles.chatItem}>
            <Text>Чат с пользователем: {item.partnerId}</Text>
            <Text>Последнее сообщение: {item.lastMessage.text}</Text>
            <Text>Время: {item.lastMessage.time}</Text>
          </View>
        )}
      />
      <TouchableOpacity onPress={Sumbmit}>
        <Text>Привет!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
