// Landing.tsx
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
import Footer from '../(pages)/footer';

const FOOTER_HEIGHT = 70;
const { width: screenWidth } = Dimensions.get('window');

type ProductItem = {
  name: string;
  desc: string;
  route: string;
  image: any;
  icon: string;
  features: string[];
};

export default function LandingScreen() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [userProducts, setUserProducts] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>('');
  
  // Animation references
  const glowAnim = useRef(new Animated.Value(0.8)).current;
  const headerGlowAnim = useRef(new Animated.Value(0.9)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserProducts(data);
      } catch (err) {
        console.error('Fetch error:', err);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous glow animations
    const productGlowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const headerGlowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(headerGlowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(headerGlowAnim, {
          toValue: 0.9,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    productGlowAnimation.start();
    headerGlowAnimation.start();

    return () => {
      productGlowAnimation.stop();
      headerGlowAnimation.stop();
    };
  }, []);

  const items: ProductItem[] = [
    {
      name: 'Uno',
      desc: 'Single valve precision watering with WiFi/4G connectivity for up to 100 plants in weatherproof IP65 design.',
      route: '/quadra_screens/screen1',
      image: require('../../assets/images/Uno.jpg'),
      icon: 'water-pump',
      features: ['WiFi/4G Enabled', 'IP65 Weatherproof', 'Up to 100 Plants'],
    },
    {
      name: 'Quadra',
      desc: 'Solar-powered irrigation revolution with 4-valve management for large-scale agricultural solutions.',
      route: '/quadra_screens/screen1',
      image: require('../../assets/images/Quadra.jpg'),
      icon: 'solar-panel',
      features: ['Solar Powered', '4 Valve Control', 'Large Scale'],
    },
    {
      name: 'Hexa',
      desc: 'Elegant hexagonal smart tank with intelligent scheduling, perfectly designed for modern balcony gardens.',
      route: '/quadra_screens/screen1',
      image: require('../../assets/images/Hexa.jpg'),
      icon: 'home-city',
      features: ['Smart Scheduling', 'Balcony Design', 'Hexagonal Tank'],
    },
    {
      name: 'Octa',
      desc: 'Advanced 8-valve management system with precision scheduling for comprehensive irrigation control.',
      route: '/quadra_screens/screen1',
      image: require('../../assets/images/Octa.jpg'),
      icon: 'cog-clockwise',
      features: ['8 Valve Control', 'Precision Timing', 'Advanced Control'],
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <Background>
        <ScrollView 
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: FOOTER_HEIGHT + 30 }]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.container,
              {
                opacity: fadeInAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            {/* Enhanced Company Header */}
            <Animated.View style={[styles.header, { opacity: headerGlowAnim }]}>
              <View style={styles.headerContainer}>
                <View style={styles.logoSection}>
                  <View style={styles.logoIcon}>
                    <MaterialCommunityIcons name="leaf" size={32} color="#FFFFFF" />
                  </View>
                  <View style={styles.companyInfo}>
                    <Text style={styles.headerText}>Ukshati Technologies</Text>
                    <Text style={styles.headerSubtext}>Private Limited</Text>
                    <View style={styles.taglineContainer}>
                      <View style={styles.taglineDot} />
                      <Text style={styles.tagline}>Smart Irrigation Solutions</Text>
                      <View style={styles.taglineDot} />
                    </View>
                  </View>
                </View>
                
                <View style={styles.headerAccent}>
                  <View style={styles.accentLine} />
                  <MaterialCommunityIcons name="sprout-outline" size={20} color="#00C853" />
                  <View style={styles.accentLine} />
                </View>
              </View>
            </Animated.View>

            {/* Enhanced Products Section */}
            <Animated.View style={[styles.productsSection, { opacity: glowAnim }]}>
              <View style={styles.productsHeader}>
                <View style={styles.sectionIcon}>
                  <MaterialCommunityIcons name="package-variant" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.productsText}>Our Products</Text>
                <Text style={styles.productsSubtext}>Innovative Irrigation Technology</Text>
              </View>

              <View style={styles.grid}>
                {items.map((item, index) => {
                  const isDisabled = !userProducts.includes(item.name);
                  
                  return (
                    <Animated.View
                      key={item.name}
                      style={[
                        styles.cardContainer,
                        {
                          transform: [
                            {
                              scale: hovered === item.name ? 1.03 : 1,
                            },
                          ],
                        },
                      ]}
                    >
                      <Pressable
                        onPress={() => !isDisabled && router.push(item.route as any)}
                        onPressIn={() => !isDisabled && setHovered(item.name)}
                        onPressOut={() => setHovered(null)}
                        style={[
                          styles.card,
                          hovered === item.name && styles.cardHovered,
                          isDisabled && styles.disabledCard,
                        ]}
                      >
                        {/* Card Header */}
                        <View style={styles.cardHeader}>
                          <View style={[styles.cardIcon, isDisabled && styles.disabledIcon]}>
                            <MaterialCommunityIcons 
                              name={item.icon as any} 
                              size={24} 
                              color={isDisabled ? "#999" : "#FFFFFF"} 
                            />
                          </View>
                          <Text style={[styles.cardTitle, isDisabled && styles.disabledText]}>
                            {item.name}
                          </Text>
                        </View>

                        {/* Product Image */}
                        <View style={styles.imageContainer}>
                          <Image source={item.image} style={[styles.image, isDisabled && styles.disabledImage]} />
                          {!isDisabled && (
                            <View style={styles.imageOverlay}>
                              <MaterialCommunityIcons name="eye" size={20} color="#FFFFFF" />
                            </View>
                          )}
                        </View>

                        {/* Card Content */}
                        <View style={styles.cardContent}>
                          <Text style={[styles.desc, isDisabled && styles.disabledText]}>
                            {item.desc}
                          </Text>

                          {/* Features */}
                          <View style={styles.featuresContainer}>
                            {item.features.map((feature, idx) => (
                              <View key={idx} style={[styles.featureTag, isDisabled && styles.disabledFeature]}>
                                <Text style={[styles.featureText, isDisabled && styles.disabledFeatureText]}>
                                  {feature}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>

                        {/* Action Button */}
                        <Pressable
                          onPress={() => !isDisabled && router.replace(item.route as any)}
                          style={[
                            styles.actionButton,
                            hovered === item.name && styles.actionButtonHovered,
                            isDisabled && styles.disabledButton,
                          ]}
                          disabled={isDisabled}
                        >
                          <Text style={[styles.actionButtonText, isDisabled && styles.disabledButtonText]}>
                            {isDisabled ? 'Not Available' : 'Explore Now'}
                          </Text>
                          {!isDisabled && (
                            <MaterialCommunityIcons name="arrow-right" size={16} color="#FFFFFF" />
                          )}
                        </Pressable>
                      </Pressable>
                    </Animated.View>
                  );
                })}
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>

        <Footer activeTab="Landing" />
      </Background>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
  },
  
  // Enhanced Header Styles
  header: {
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    width: 52,
    height: 52,
    backgroundColor: '#00C853',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  companyInfo: {
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B5E20',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  headerSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#388E3C',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagline: {
    fontSize: 10,
    color: '#66BB6A',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginHorizontal: 8,
  },
  taglineDot: {
    width: 4,
    height: 4,
    backgroundColor: '#00C853',
    borderRadius: 2,
  },
  headerAccent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  accentLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#00C853',
    borderRadius: 1,
    opacity: 0.7,
  },

  // Enhanced Products Section
  productsSection: {
    width: '100%',
    paddingHorizontal: 16,
  },
  productsHeader: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionIcon: {
    width: 42,
    height: 42,
    backgroundColor: '#00C853',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  productsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 4,
  },
  productsSubtext: {
    fontSize: 8,
    color: '#66BB6A',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Enhanced Grid and Cards
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  cardContainer: {
    width: screenWidth > 600 ? (screenWidth - 64) / 2 : screenWidth - 32,
    maxWidth: 340,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E8F5E8',
    minHeight: 420,
  },
  cardHovered: {
    shadowColor: '#00C853',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    borderColor: '#00C853',
  },
  disabledCard: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
    borderColor: '#E0E0E0',
  },

  // Card Components
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#00C853',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledIcon: {
    backgroundColor: '#BDBDBD',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1B5E20',
    flex: 1,
  },
  disabledText: {
    color: '#999999',
  },

  imageContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 12,
  },
  disabledImage: {
    opacity: 0.5,
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(0, 200, 83, 0.8)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardContent: {
    flex: 1,
    marginBottom: 16,
  },
  desc: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'left',
  },

  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featureTag: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  disabledFeature: {
    backgroundColor: '#F0F0F0',
    borderColor: '#E0E0E0',
  },
  featureText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
  },
  disabledFeatureText: {
    color: '#999999',
  },

  actionButton: {
    backgroundColor: '#00C853',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonHovered: {
    backgroundColor: '#00E676',
    transform: [{ translateY: -2 }],
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    shadowColor: 'transparent',
    elevation: 0,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#999999',
  },
});