import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

const API_KEY = Constants.expoConfig?.extra?.API_KEY ?? ''; 

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      try {
        // Request location permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied.');
          setLoading(false);
          return;
        }

        // Get current location
        let currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;

        // Fetch weather data using the user's location
        const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
        const response = await axios.get(API_URL);
        setWeatherData(response.data);
      } catch (err) {
        setError('Failed to fetch weather data. Please check your API key or connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndWeather();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  // Extract required weather details
  const { city, list } = weatherData;
  const tempCelsius = (list[0].main.temp - 273.15).toFixed(2); // Convert Kelvin to Celsius
  const { description } = list[0].weather[0];
  const { speed } = list[0].wind;

  return (
    <View style={styles.container}>
      <Text style={styles.cityText}>{city.name}</Text>
      <Text style={styles.weatherText}>Temperature: {tempCelsius}°C | Weather: {description}</Text>
      <Text style={styles.weatherText}> Wind Speed: {speed} m/s </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weatherText: {
    fontSize: 12,
    marginTop: 5,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    textAlign: 'center',
    marginTop: 220,
  },
});

export default WeatherComponent;