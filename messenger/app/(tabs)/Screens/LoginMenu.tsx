import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet, Platform, SafeAreaView, Text, TextInput, TouchableOpacity} from 'react-native';




export default function LoginScreen() {
  const [email, onChangeEmail] = React.useState('')
  const [password, onChangePassword] = React.useState('')

  const PressButton = () =>{
    return 
  }

  return (
    <SafeAreaView style={styles.container}>
        <TextInput style={styles.inputTextInput} onChangeText={onChangeEmail} value={email} placeholder="Введите почту" keyboardType="email-address"></TextInput>
        <TextInput style={styles.inputTextInput} onChangeText={onChangePassword} value={password} secureTextEntry={true} placeholder="Введите пароль"></TextInput>
        <TouchableOpacity style={styles.button} onPress={PressButton}>
          <Text>Войти</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 200,
    paddingLeft: 75,
    paddingRight: 75
  },
  inputTextInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button:{
    paddingTop:4,
    marginTop:7,
    marginLeft:95,
    marginRight:85,
    width:70,
    height:30,
    backgroundColor: "#1e90ff",
    alignItems: 'center'
  }
});
