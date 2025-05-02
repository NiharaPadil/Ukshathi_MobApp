// index.js
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
import Background from '../components_ad/Background';



// 1️⃣ Ensure notifications show in foreground
Notifications.setNotificationHandler({
  // 2️⃣ Show alerts even when app is foregrounded
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 2️⃣ Helper to register and get Expo push token
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    Alert.alert('Must use a physical device for Push Notifications');
    return null;
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    Alert.alert('Failed to get push token!');
    return null;
  }
  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
}


export default function Index() {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // !!!!!!!! Make sure to set this in your app.json (your ip adress) otherwise your backend will not work
  const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? "";


  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    // Register for notifications
    registerForPushNotificationsAsync()
      .then(token => console.log('Push Token:', token))
      .catch(err => console.error(err));

    // Listen for incoming notifications (foreground & background)
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for user tapping on notification (background & terminated)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // e.g. router.push('/notification-details/' + response.notification.request.content.data.id)
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  //if the user is logged in, will redirect them to the landing page
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userID");
        if (storedUserId) {
          console.log("User ID found:", storedUserId); //debug point
          router.replace("./Landing"); // Redirect to landing page if user is already logged in
        }
      } catch (error) {
        console.error("Error checking user session:", error);
      }
    };

    checkUserSession();
  }, []);

  //handle login function ,this function will be called when the user clicks the login button,it will send a post request to the backend with the user email and password
  //if the login is successful, it will store the user id in async storage and redirect to the landing page
  const handleLogin = async () => {
    if (!userEmail || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      console.log("Attempting login with", { userEmail, password }); //debug point

      // Attempt login with email, password, and push token
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          passwordHash: password,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data); //debug point

      if (response.ok) {
        if (!data.userID) {
          throw new Error("User ID missing in response");
        }

        // Store user ID in AsyncStorage
        await AsyncStorage.setItem("userID", data.userID.toString()); // Store user ID in AsyncStorage
        console.log("User ID stored:", data.userID); //debug point

        // Redirect to landing page
        router.replace("/Landing");
      } else {
        throw new Error(data.message || "Invalid credentials");
      }
    } catch (error: any) {
      if (error instanceof Error) {
        console.error("Login Error:", error.message);
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Background>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/logowithleaf.png")}
          style={styles.logoImage}
        />
        <Text style={styles.loginText}>Login</Text>

        <TextInput
          placeholder="Email"
          value={userEmail}
          onChangeText={setUserEmail}
          style={styles.input}
          placeholderTextColor="#a9a9a9"
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
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIconContainer}
          >
            <Image
              source={
                isPasswordVisible
                  ? require("../assets/images/visible.png")
                  : require("../assets/images/hide.png")
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
            source={require("../assets/images/google.png")}
            style={styles.googleLogo}
          />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.signupTextContainer}>
          <Text style={styles.signupText}>New User? </Text>
          <TouchableOpacity onPress={() => router.push("./Register")}>
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
    justifyContent: "center",
    padding: 16,
  },
  logoImage: {
    width: "80%",
    height: "20%",
    alignSelf: "center",
  },
  loginText: {
    fontSize: 20,
    textAlign: "left",
    paddingLeft: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    width: "90%",
    alignSelf: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    width: "90%",
    alignSelf: "center",
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
    color: "red",
    textAlign: "center",
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: "#1e7218",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    marginBottom: 10,
  },
  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    width: "90%",
    alignSelf: "center",
  },
  googleButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  signupTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#000",
  },
  signupLink: {
    color: "#1e7218",
    marginLeft: 5,
    fontWeight: "bold",
  },
});
