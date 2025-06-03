import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import Background from '../../components_ad/Background';

export default function LandingScreen() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [userProducts, setUserProducts] = useState([]);
  const [userId, setUserId] = useState('');

  const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userID');
        if (!storedUserId) {
          Alert.alert('Error', 'User not logged in');
          return;
        }

        setUserId(storedUserId);

        const response = await fetch(`${API_BASE_URL}/device/controller/${storedUserId}`);
        const data = await response.json();
        setUserProducts(data);
      } catch (err) {
        console.error('Fetch error:', err);
        Alert.alert('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const items = [
    {
      name: 'Uno',
      desc: 'A single valve system for precise, Wifi/4G-enabled watering of up to 100 plants, all in a weatherproof IP65 design.',
      route: '/quadra_screens/screen1',
      image: require('../../assets/images/Uno.jpg'),
    },
    {
      name: 'Quadra',
      desc: 'QUADRA revolutionizes large-scale irrigation with solar-powered nodes managing up to 4 valves.',
      route: '/quadra_screens/screen1',
      image: require('../../assets/images/Quadra.jpg'),
    },
    {
      name: 'Hexa',
      desc: 'A sleek hexagonal tank with smart scheduling, designed for balconies.',
      route: '/quadra_screens/screen1',
      image: require('../../assets/images/Hexa.jpg'),
    },
    {
      name: 'Octa',
      desc: 'Manage up to 8 valves with precision scheduling.',
      route: '/quadra_screens/screen1',
      image: require('../../assets/images/Octa.jpg'),
    },
  ];

  const userPermissions: string[] = userProducts;

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Removed Header with Menu text and Logout button */}

          <View style={styles.grid}>
            {items.map((item) => {
              const isDisabled = !userPermissions.includes(item.name);

              return (
                <Pressable
                  key={item.name}
                  onPress={() => !isDisabled && router.push(item.route)}
                  onPressIn={() => !isDisabled && setHovered(item.name)}
                  onPressOut={() => setHovered(null)}
                  style={[
                    styles.card,
                    hovered === item.name && styles.hovered,
                    isDisabled && styles.disabledCard,
                  ]}
                >
                  <Image source={item.image} style={styles.image} />
                  <Text style={[styles.cardTitle, isDisabled && styles.disabledText]}>
                    {item.name}
                  </Text>
                  <Text style={styles.desc}>{item.desc}</Text>

                  <Pressable
                    onPress={() => !isDisabled && router.replace(item.route)}
                    style={({ pressed }) => [
                      styles.knowMore,
                      pressed && styles.pressed,
                      hovered === item.name && styles.knowMoreHovered,
                    ]}
                  >
                    <Text style={styles.knowMoreText}>Know More</Text>
                  </Pressable>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </Background>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 50,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#71BC78',
    borderRadius: 12,
    width: 300,
    minHeight: 350,
    padding: 20,
    margin: 10,
    alignItems: 'center',
    elevation: 5,
  },
  hovered: {
    transform: [{ scale: 1.02 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  disabledCard: {
    backgroundColor: '#D0E1D6',
    opacity: 0.6,
  },
  image: {
    width: 160,
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Montserrat',
  },
  disabledText: {
    color: '#888',
  },
  desc: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
    lineHeight: 20,
    flex: 1,
  },
  knowMore: {
    marginTop: 15,
    backgroundColor: '#00693E',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  knowMoreHovered: {
    transform: [{ translateY: -2 }],
  },
  knowMoreText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    backgroundColor: '#5E9473',
  },
});
