import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WeatherComponent from '../WeatherInfo';

export default function Header({ valveID }: { valveID: string | number }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Valve Control System for {valveID}</Text>
      <View style={styles.weatherInfo}>
        <WeatherComponent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 30,
    alignItems: 'center',
    borderRadius: 18,
    shadowColor: '#000',
    elevation: 4,
    height: 260,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  weatherInfo: {
    padding: -100,
    marginTop: -100,
    alignItems: 'center',
  },
});