//NotificationsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

const NotificationsScreen = () => {
  const [userId, setUserId] = useState(null);

  // Get user ID from AsyncStorage when component mounts
  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userID');
        setUserId(storedUserId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    getUserId();
  }, []);

  const handleSaveNotification = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/noti/save-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          message: 'New notification from mobile app',
        }),
      });

      const data = await response.json();
      Alert.alert(data.success ? 'Success' : 'Error', data.message || 'Notification saved');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleReceiveNotification = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/noti/get-latest-notification/${userId}`);
      const data = await response.json();

      if (!data.success || !data.notification) {
        return Alert.alert('Info', 'No notifications found');
      }

      const pushResponse = await fetch(`${API_BASE_URL}/noti/send-push/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: data.notification.Message,
        }),
      });

      const pushData = await pushResponse.json();
      Alert.alert(pushData.success ? 'Success' : 'Error', pushData.message);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleSaveNotification}>
        <Text style={styles.buttonText}>Save Notification to DB</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleReceiveNotification}>
        <Text style={styles.buttonText}>Trigger Push Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
