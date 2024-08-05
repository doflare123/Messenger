import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, SafeAreaView } from 'react-native';
import * as Font from 'expo-font';
import { SplashScreen } from 'expo-router';
import Navigator from "../../navigate";



const loadFonts = () => {
  return Font.loadAsync({
    'SemiBold': require('../../assets/frontStyles/Oswald-SemiBold.ttf'),
  });
};

SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontLoaded(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();   
  }, []);

  if (!fontLoaded) {
    return null; // Показываем белый экран, пока шрифты загружаются
  }

  return (
      <SafeAreaView style={styles.container}>
        <Navigator />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
