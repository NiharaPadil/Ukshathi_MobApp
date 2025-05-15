import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Animated } from 'react-native';
import Background from '../../components_ad/Background';

const AboutUsScreen = () => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Background>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ukshati Technologies Private Limited</Text>
      </View>
      
      <Animated.View style={[styles.imageContainer, { transform: [{ translateX: shakeAnim }] }]}>
        <Image source={require('../../assets/images/logowithleaf.png')} style={styles.logo} />
      </Animated.View>
      
      <Text style={styles.sectionTitle}>Innovation for Sustainable Farming</Text>
      
      <Text style={styles.paragraph}>
        Established in 2017 and incorporated as a private limited company in 2022, Ukshati leverages cutting-edge infrastructure to benefit farmers and humanity. 
        Committed to sustainable productivity, we provide digital farming solutions, greenhouses, and IoT-based irrigation systems.
      </Text>
      
      <Text style={styles.paragraph}>
        Our devices cater to gardens of all sizes, offering solutions like water tank-based systems for balconies and waterproof models for outdoor use. 
        These systems optimize water usage, ensuring efficiency and convenience.
      </Text>
      
      <Text style={styles.paragraph}>
        Our automatic irrigation system offers real-time visibility and control. With controllers and nodes installed in the field, users can manage irrigation through a mobile app or website, ensuring seamless operation via the internet.
      </Text>
      
      <Text style={styles.paragraph}>
        At Ukshati Technologies, we are dedicated to empowering farmers and households with innovative, reliable, and sustainable water-management solutions.
      </Text>
    </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    marginTop: 55,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D5A3D',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#228B22',
    fontFamily: 'Montserrat',
    textAlign: 'center',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  paragraph: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    fontFamily: 'Montserrat',
    marginBottom: 15,
    textAlign: 'justify',
  },
});

export default AboutUsScreen;