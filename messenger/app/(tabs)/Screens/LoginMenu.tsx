import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet, Platform, SafeAreaView, Text } from 'react-native';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>test text</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
  },
  text: {
    marginTop: 8,
    fontSize: 25,
    color: 'black',
    fontFamily: 'SemiBold'
  }
});
