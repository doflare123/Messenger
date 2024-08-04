import { Image, StyleSheet, Platform, SafeAreaView } from 'react-native';
import Head from '../HeadForm';

export default function MainScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Head/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
