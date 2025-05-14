




// index.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Application from 'expo-application';
import Background from '../components_ad/Background';

// 1. Notification handler (only allowed keys)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync(): Promise<string | null> {
  // Must be on a real device
  if (!Device.isDevice) {
    Alert.alert('Push notifications require a physical device.');
    return null;
  }

  // 1. Ask permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    Alert.alert('Failed to get push permissions!');
    return null;
  }

  // 2. Get Expo push token
  const pushTokenResponse = await Notifications.getExpoPushTokenAsync(
    Constants.expoConfig?.extra?.eas?.projectId
      ? { projectId: Constants.expoConfig.extra.eas.projectId }
      : {}
  );
  const expoPushToken = pushTokenResponse.data;

  // 3. Grab a unique device identifier based on platform
  let deviceId = '';
  if (Platform.OS === 'android') {
    deviceId = (await Application.getAndroidId()) ?? '';
    if (!deviceId) console.warn('Android ID unavailable');
  } else {
    try {
      const iosId = await Application.getIosIdForVendorAsync();
      deviceId = iosId ?? '';
      if (!deviceId) console.warn('iOS vendor ID unavailable');
    } catch (err) {
      console.warn('Error fetching iOS vendor ID:', err);
    }
  }

  // 4. Persist both values
  await AsyncStorage.multiSet([
    ['expoPushToken', expoPushToken],
    ['deviceId', deviceId],
  ]);

  return expoPushToken;
}

export default function Index() {
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Setup and cleanup notifications
    (async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        console.log('Push Token:', token);

        notificationListener.current =
          Notifications.addNotificationReceivedListener(notification =>
            console.log('Notification received:', notification)
          );

        responseListener.current =
          Notifications.addNotificationResponseReceivedListener(response =>
            console.log('Notification response:', response)
          );
      } catch (err) {
        console.error('Notification setup error:', err);
      }
    })();

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  useEffect(() => {
    // Auto-redirect if already logged in
    (async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userID');
        if (storedUserId) {
          router.replace('./Landing');
        }
      } catch (err) {
        console.error('Error checking user session:', err);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!userEmail || !password) {
      setErrorMessage('Email and password are required');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // 1. Authenticate
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          passwordHash: password,
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }
      if (!data.userID) {
        throw new Error('User ID missing in response');
      }

      // 2. Persist user ID
      await AsyncStorage.setItem('userID', data.userID.toString());

      // 3. Register device with your backend (non-blocking)
      (async () => {
        try {
          const store = await AsyncStorage.multiGet([
            'expoPushToken',
            'deviceId',
          ]);
          const token = store[0][1];
          const deviceId = store[1][1];

          if (token && deviceId) {
            const devResp = await fetch(
              `${API_BASE_URL}/noti/register-device`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: data.userID,
                  token,
                  deviceId,
                }),
              }
            );

            if (!devResp.ok) {
              const errData = await devResp.json();
              console.warn('Device reg warning:', errData);
            } else {
              console.log('Device registered successfully');
            }
          }
        } catch (e) {
          console.warn('Non-critical device reg error:', e);
        }
      })();

      // 4. Navigate
      router.replace('/Landing');
    } catch (err) {
      console.error('Login Error:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Background>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logowithleaf.png')}
          style={styles.logoImage}
        />
        <Text style={styles.loginText}>Login</Text>

        <TextInput
          placeholder="Email"
          value={userEmail}
          onChangeText={setUserEmail}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            style={styles.passwordInput}
            placeholderTextColor="#a9a9a9"
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(prev => !prev)}
            style={styles.eyeIconContainer}
            accessibilityLabel={
              isPasswordVisible ? 'Hide password' : 'Show password'
            }
          >
            <Image
              source={
                isPasswordVisible
                  ? require('../assets/images/visible.png')
                  : require('../assets/images/hide.png')
              }
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity
          testID="login-button"
          onPress={handleLogin}
          style={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={require('../assets/images/google.png')}
            style={styles.googleLogo}
          />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.signupTextContainer}>
          <Text style={styles.signupText}>New User? </Text>
          <TouchableOpacity onPress={() => router.push('./Register')}>
            <Text style={styles.signupLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: -25,
    justifyContent: 'center',
    padding: 16,
  },
  logoImage: {
    width: '80%',
    height: '20%',
    alignSelf: 'center',
  },
  loginText: {
    fontSize: 20,
    textAlign: 'left',
    paddingLeft: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
  },
  eyeIconContainer: {
    padding: 10,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: '#1e7218',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
  },
  googleButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  signupTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#000',
  },
  signupLink: {
    color: '#1e7218',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

