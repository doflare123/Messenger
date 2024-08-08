import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet, Platform, SafeAreaView, Text, TextInput, TouchableOpacity,} from 'react-native';
import { Formik, useFormik } from 'formik'
import {generateSalt, hashPassword} from "../../../serverConfg/crypt";


export default function LoginScreen({ navigation }) {
  const PressReg = () => {
    navigation.navigate('Registration');
  };


  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={ async values => {
          
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
            <TouchableOpacity style={styles.textReg} onPress={PressReg}>
              <Text style={styles.touchableText}>Еще нет аккаунта?</Text>
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
  button:{
    paddingTop:4,
    marginTop:7,
    marginLeft:95,
    marginRight:85,
    width:70,
    height:30,
    backgroundColor: "#1e90ff",
    alignItems: 'center'
  },
  touchableText:{
    color:"#458ed6",
    fontSize: 12,
    marginTop:-9,
    marginLeft:96,
    width:110
  },
  textReg:{
    marginLeft:50,
    width:0
  }
});
