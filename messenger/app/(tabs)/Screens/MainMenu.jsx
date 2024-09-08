import React, { useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Text, View, TouchableOpacity } from 'react-native';
import { GetToken, GetUserId } from '../../../JwtTokens/JwtStorege';
import { useWebSocket } from '@/WebSoket/WSConnection';
import { useFocusEffect } from '@react-navigation/native';

export default function MainScreen({ navigation }) {
  const socket = useWebSocket();
  const [Chats, setChats] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const fetchChats = useCallback(async () => {
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
            setIsDataFetched(true); // Помечаем данные как полученные
          } else {
            console.error('Ошибка получения диалогов:', response.message);
          }
        };
      }
    } catch (error) {
      console.error('Ошибка при получении диалогов:', error);
    }
  }, [socket]);

  useFocusEffect(
    useCallback(() => {
      if (!isDataFetched) {
        fetchChats();
      }
      return () => {
        if (socket) {
          socket.onmessage = null;
        }
      };
    }, [fetchChats, isDataFetched, socket])
  );

  const ClickFun = (partnerId) => {
    navigation.navigate("Chat", { title: partnerId });
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={Chats}
        keyExtractor={(item) => item.partnerId}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => ClickFun(item.partnerId)} style={styles.chatItem}>
            <View style={styles.avatarContainer}>
              <Text>{item.partnerId.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{item.partnerId}</Text>
              <View style={styles.messageContainer}>
                <Text style={styles.lastMessage}>{item.lastMessage.text}</Text>
                <Text style={styles.time}>{item.lastMessage.time.slice(0, 5)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#DCDCDC',
  },
  avatarContainer: {
    marginRight: 10,
    width: 50, 
    height: 50,
    borderRadius: 25, 
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center'
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  lastMessage: {
    color: '#555',
    marginTop: 2,
    flexShrink: 1,
  },
  time: {
    color: '#888',
    fontSize: 12,
    marginLeft: 10,
  },
});
