import React from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Alert } from 'react-native';


export default function Head() {
  const PressButtonSwitch = () => {
    Alert.alert("Text Pressed", "You pressed the text!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.Head}>
        <TouchableOpacity onPress={PressButtonSwitch} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>≡</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={PressButtonSwitch} style={styles.textContainer}>
          <Text style={styles.text}>Диалоги</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Head: {
    paddingTop: 30,
    height: 120,
    backgroundColor: 'silver',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    marginLeft: -240,
    marginTop: 8,
    fontSize: 25,
    color: 'black',
    fontFamily: 'SemiBold'
  },
  buttonContainer: {
    padding: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 70,
  },
});
