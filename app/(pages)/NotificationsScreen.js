import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

const NotificationsScreen = () => {
  const [userId, setUserId] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingPush, setLoadingPush] = useState(false);

  // Fetch user ID from AsyncStorage on mount
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

  // Save notification to DB
  const handleSaveNotification = useCallback(async () => {
    if (!userId) {
      return Alert.alert('Error', 'User ID not found. Please log in.');
    }

    setLoadingSave(true);

    try {
      const response = await fetch(`${API_BASE_URL}/noti/save-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: 'New notification from mobile app',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      Alert.alert(data.success ? 'Success' : 'Error', data.message || 'Notification saved');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save notification');
    } finally {
      setLoadingSave(false);
    }
  }, [userId]);

  // Fetch latest notification and trigger push
  const handleReceiveNotification = useCallback(async () => {
    if (!userId) {
      return Alert.alert('Error', 'User ID not found. Please log in.');
    }

    setLoadingPush(true);

    try {
      const response = await fetch(`${API_BASE_URL}/noti/get-latest-notification/${userId}`);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

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

      if (!pushResponse.ok) {
        throw new Error(`Server error: ${pushResponse.status}`);
      }

      const pushData = await pushResponse.json();
      Alert.alert(pushData.success ? 'Success' : 'Error', pushData.message);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to trigger push notification');
    } finally {
      setLoadingPush(false);
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, loadingSave && styles.buttonDisabled]}
        onPress={handleSaveNotification}
        disabled={loadingSave || !userId}
      >
        {loadingSave ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Notification to DB</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loadingPush && styles.buttonDisabled]}
        onPress={handleReceiveNotification}
        disabled={loadingPush || !userId}
      >
        {loadingPush ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Trigger Push Notification</Text>
        )}
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
