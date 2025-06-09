// app/(pages)/ContactScreen.js
import React from 'react';
import { View, Text, StyleSheet, Linking, Pressable, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import Background from '../../components_ad/Background';
import Footer from '../(pages)/footer'; // Adjust path as per your project structure

const FOOTER_HEIGHT = 70;

const ContactScreen = () => {
  const latitude = 12.87607;
  const longitude = 74.846305;

  return (
    <Background>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: FOOTER_HEIGHT + 20 }]}
        >
          {/* Map View */}
          <MapView
            style={styles.map}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={{ latitude, longitude }} title="Ukshati Technologies Pvt Ltd" />
          </MapView>

          {/* Contact Information */}
          <View style={styles.infoContainer}>
            <Text style={styles.header}>Contact Us</Text>
            
            <View style={[styles.card, styles.locationCard]}>
              <FontAwesome name="map-marker" size={24} color="#2D5A3D" />
              <View style={styles.textContainer}>
                <Text style={styles.title}>Location</Text>
                <Text style={styles.text}>
                  Ukshati Technologies Pvt Ltd, II Floor, Pramod Towers, KRR Road, Mangaluru, Karnataka 575002
                </Text>
              </View>
            </View>

            <View style={[styles.card, styles.emailCard]}>
              <MaterialIcons name="email" size={24} color="#0066CC" />
              <View style={styles.textContainer}>
                <Text style={styles.title}>Email</Text>
                <Pressable
                  onPress={() => Linking.openURL('mailto:ukshati365@gmail.com')}
                  accessibilityRole="link"
                  accessibilityLabel="Send email to ukshati365@gmail.com"
                >
                  <Text style={[styles.text, styles.linkText]}>
                    ukshati365@gmail.com
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={[styles.card, styles.phoneCard]}>
              <Entypo name="phone" size={24} color="#D32F2F" />
              <View style={styles.textContainer}>
                <Text style={styles.title}>Phone</Text>
                <Pressable
                  onPress={() => Linking.openURL('tel:+918861567365')}
                  accessibilityRole="link"
                  accessibilityLabel="Call +91 8861567365"
                >
                  <Text style={[styles.text, styles.linkText]}>
                    +91 8861567365
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Unified Footer */}
        <Footer activeTab="Contact" />
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2D5A3D',
  },
  map: {
    marginBottom: 20,
    marginTop: 20,
    height: 250,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  infoContainer: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    minHeight: 100,
    justifyContent: 'flex-start',
  },
  locationCard: {
    backgroundColor: '#E8F5E9',
  },
  emailCard: {
    backgroundColor: '#E3F2FD',
  },
  phoneCard: {
    backgroundColor: '#FFEBEE',
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2D5A3D',
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  linkText: {
    color: '#0066CC',
    textDecorationLine: 'underline',
  },
});

export default ContactScreen;