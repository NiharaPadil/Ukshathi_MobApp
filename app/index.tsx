

import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator 
} from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Background from '../components_ad/Background'

export default function Index() {
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

  useEffect(() => {
    // Load stored user ID on mount (optional: if needed for auto-login later)
    const checkUserSession = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userID');
        if (storedUserId) {
          console.log('User ID found:', storedUserId); //debug point
          router.replace('./Landing'); // Redirect to landing page if user is already logged in
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      }
    };

    checkUserSession();
  }, []);

  const handleLogin = async () => { 
    if (!userEmail || !password) {
      setErrorMessage('Email and password are required');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      console.log('Attempting login with', { userEmail, password }); //debug point


     // Attempting login with email and password
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, passwordHash: password }),
      });

      const data = await response.json();
      
      console.log('API Response:', data); //debug point

      if (response.ok) {
        if (!data.userID) {
          throw new Error('User ID missing in response');
        }

        await AsyncStorage.setItem('userID', data.userID.toString());
        console.log('User ID stored:', data.userID);

        // Will see later , if i need names 
         //await AsyncStorage.setItem('name', data.name); // Store user name for later use
        //console.log('User Name stored:', data.name); //debugg
      //Alert.alert('Login Successful', `Welcome, ${username}!`);

      
        router.replace('/Landing');
      } else {
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (error: any) {
      if (error instanceof Error) {
        console.error('Login Error:', error.message);
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Background>
    <View style={styles.container}>
      <Image source={require('../assets/images/logowithleaf.png')} style={styles.logoImage} /> 
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
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIconContainer}>
          <Image
            source={isPasswordVisible ? require('../assets/images/visible.png') : require('../assets/images/hide.png')}
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity testID="login-button" onPress={handleLogin} style={styles.loginButton} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Image source={require('../assets/images/google.png')} style={styles.googleLogo} />
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

// import { View, Text, Button } from "react-native";
// import { useRouter } from "expo-router";

// export default function Index() {
//   const router = useRouter();

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ fontSize: 24, fontWeight: "bold" }}>Welcome to the App</Text>
//       <Button title="Get Started" onPress={() => router.push("/Landing")} />
//     </View>
//   );
// }




