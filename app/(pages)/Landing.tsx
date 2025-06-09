import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Background from '../../components_ad/Background';

const FOOTER_HEIGHT = 70;

export default function LandingScreen() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [userProducts, setUserProducts] = useState([]);
  const [userId, setUserId] = useState('');
  const glowAnim = useRef(new Animated.Value(0.7)).current;
  const [activeTab, setActiveTab] = useState('About');

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

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
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

  // Footer tab items:
  const footerTabs: {
    key: string;
    label: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  }[] = [
    { key: 'Landing', label: 'Home', icon: 'home' },
    { key: 'Notifications', label: 'Notification', icon: 'bell' },
    { key: 'Contact', label: 'Contact', icon: 'phone' },
    { key: 'Queries', label: 'Queries', icon: 'message-text' },
  ];

  // Handle footer tab press navigation:
  const handleTabPress = (key: string) => {
    setActiveTab(key);
    switch (key) {
      case 'About':
        router.push('/AboutUsScreen');
        break;
      case 'Notifications':
        router.push('/NotificationsScreen');
        break;
      case 'Contact':
        router.push('/ContactScreen');
        break;
      case 'Queries':
        router.push('/Queries');
        break;
    }
  };

  return (
    <Background>
      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: FOOTER_HEIGHT + 20 }]}>
        <View style={styles.container}>
          {/* Title section with mirrored leaf */}
          <Animated.View style={[styles.productsHeader, { opacity: glowAnim }]}>
            <MaterialCommunityIcons name="leaf" size={22} color="#388E3C" />
            <Text style={styles.productsText}>Products</Text>
            <MaterialCommunityIcons
              name="leaf"
              size={22}
              color="#388E3C"
              style={{ transform: [{ scaleX: -1 }] }}
            />
          </Animated.View>

          <View style={styles.grid}>
            {items.map((item) => {
              const isDisabled = !userPermissions.includes(item.name);

              return (
                <Pressable
                  key={item.name}
                  onPress={() => !isDisabled && router.push(item.route as any)}
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
                    onPress={() => !isDisabled && router.replace(item.route as any)}
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

      {/* FOOTER */}
      <View style={styles.footerContainer}>
        {footerTabs.map(({ key, label, icon }) => {
          const isActive = activeTab === key;
          return (
            <Pressable
              key={key}
              onPress={() => handleTabPress(key)}
              style={({ pressed }) => [
                styles.footerTab,
                isActive && styles.footerTabActive,
                pressed && styles.footerTabPressed,
              ]}
            >
              <MaterialCommunityIcons
                name={icon}
                size={28}
                color={isActive ? '#388E3C' : '#666'}
              />
              <Text style={[styles.footerLabel, isActive && styles.footerLabelActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
    paddingTop: 35,
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: -10,
    gap: 8,
  },
  productsText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
    fontFamily: 'cursive',
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

  // Footer styles
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: FOOTER_HEIGHT,
    backgroundColor: '#f9f9f9',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
  },
  footerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  footerTabActive: {
    borderTopWidth: 3,
    borderTopColor: '#388E3C',
  },
  footerTabPressed: {
    opacity: 0.6,
  },
  footerLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    fontWeight: '500',
  },
  footerLabelActive: {
    color: '#388E3C',
    fontWeight: '700',
  },
});
