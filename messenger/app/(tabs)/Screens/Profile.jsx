import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Modal, TextInput } from 'react-native';
import { GetUserName, GetToken, GetUserId } from '../../../JwtTokens/JwtStorege';
import { useWebSocket } from '@/WebSoket/WSConnection';

export default function ProfileUser() {
    const socket = useWebSocket();
    const [userName, setUserName] = useState('');
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isNameModalVisible, setIsNameModalVisible] = useState(false);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await GetUserName();
      setUserName(name);
    };

    fetchUserName();
  }, []);

  // Открытие модального окна для смены имени
  const handleChangeName = () => {
    setIsNameModalVisible(true);
  };

  // Сохранение нового имени
  const handleSaveName = async () => {
    const JwtToken = await GetToken();
    const UserId = await GetUserId();
    if (JwtToken && UserId) {
        const message = {
          type: 'ChangeName',
          JwtToken: JwtToken,
          UserId: UserId,
          NewName: newName
        };
        console.log(message, "Это для смены имени")

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
          }
    }
    setUserName(newName);
    setIsNameModalVisible(false); // Закрываем модальное окно
  };

  // Открытие модального окна для смены пароля
  const handleChangePassword = () => {
    setIsPasswordModalVisible(true);
  };

  // Сохранение нового пароля
  const handleSavePassword = async () => {
    const JwtToken = await GetToken();
    const UserId = await GetUserId();
    if (JwtToken && UserId) {
        const message = {
          type: 'ChangeName',
          JwtToken: JwtToken,
          UserId: UserId,
          newPassword: newPassword
        };

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
          }
    }
    setIsPasswordModalVisible(false); // Закрываем модальное окно
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Кружок с первой буквой имени */}
      <View style={styles.profileCircle}>
        <Text style={styles.profileInitial}>
          {userName ? userName.charAt(0).toUpperCase() : 'U'}
        </Text>
      </View>

      {/* Кнопка смены имени */}
      <TouchableOpacity style={styles.button} onPress={handleChangeName}>
        <Text style={styles.buttonText}>Сменить имя</Text>
      </TouchableOpacity>

      {/* Кнопка смены пароля */}
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Сменить пароль</Text>
      </TouchableOpacity>

      {/* Модальное окно для смены имени */}
      <Modal
        transparent={true}
        visible={isNameModalVisible}
        animationType="slide"
        onRequestClose={() => setIsNameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Введите новое имя:</Text>
            <TextInput
              style={styles.input}
              placeholder="Новое имя"
              value={newName}
              onChangeText={(text) => {
                setNewName(text);
            }}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleSaveName}>
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setIsNameModalVisible(false)}>
              <Text style={styles.buttonText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Модальное окно для смены пароля */}
      <Modal
        transparent={true}
        visible={isPasswordModalVisible}
        animationType="slide"
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Введите новый пароль:</Text>
            <TextInput
              style={styles.input}
              placeholder="Новый пароль"
              secureTextEntry={true}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleSavePassword}>
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setIsPasswordModalVisible(false)}>
              <Text style={styles.buttonText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileInitial: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный фон
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
});
