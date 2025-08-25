import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.hero}>
        <Text style={styles.title}>Iron Dillo</Text>
        <Text style={styles.subtitle}>
          Veteran-owned cybersecurity for East Texas small businesses, individuals, and rural operations.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A', // armadilloBlack
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  hero: {
    backgroundColor: '#F8F9FA', // offWhite
    padding: 24,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    color: '#6B7B3C', // oliveGreen
    fontFamily: 'Inter',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4A4A4A', // armadilloGray
    fontFamily: 'Inter',
    textAlign: 'center',
  },
});
