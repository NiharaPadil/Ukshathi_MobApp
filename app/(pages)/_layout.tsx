import { Stack } from 'expo-router';
import React, { useRef } from 'react';
import {
  View,
  Pressable,
  Image,
  Alert,
  StyleSheet,
  DrawerLayoutAndroid,
  Linking,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PagesLayout() {
  const router = useRouter();
  const drawerRef = useRef<DrawerLayoutAndroid>(null);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/');
    } catch (error) {
      Alert.alert('Logout Failed');
    }
  };

  const openDrawer = () => drawerRef.current?.openDrawer();

  const navigateTo = (route: string) => {
    router.push(route as any);
    drawerRef.current?.closeDrawer();
  };

  const GradientHeaderBackground = () => (
    <LinearGradient
      colors={['#4CAF50', '#ffffff', '#4CAF50']} // green sides, white center
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={StyleSheet.absoluteFill}
    />
  );

  const DrawerContent = () => (
    <LinearGradient
      colors={['#4CAF50', '#A8D5BA', '#E6F2E6', '#ffffff']}
      style={styles.drawer}
    >
      {/* Drawer items */}
      <Pressable onPress={() => navigateTo('/Landing')} style={styles.drawerItem}>
        <MaterialCommunityIcons name="home-outline" size={36} color="#000" />
      </Pressable>
      <Pressable onPress={() => navigateTo('/NotificationsScreen')} style={styles.drawerItem}>
        <MaterialCommunityIcons name="bell-outline" size={36} color="#000" />
      </Pressable>
      <Pressable onPress={() => navigateTo('/AboutUsScreen')} style={styles.drawerItem}>
        <MaterialCommunityIcons name="information-outline" size={36} color="#000" />
      </Pressable>
      <Pressable onPress={() => navigateTo('/ContactScreen')} style={styles.drawerItem}>
        <MaterialCommunityIcons name="phone-outline" size={36} color="#000" />
      </Pressable>
      <Pressable onPress={() => navigateTo('/Queries')} style={styles.drawerItem}>
        <MaterialCommunityIcons name="chat-question-outline" size={36} color="#000" />
      </Pressable>

      {/* Social Icons */}
      <View style={styles.socialContainer}>
        <Pressable onPress={() => Linking.openURL('https://instagram.com/yourpage')} style={styles.socialIcon}>
          <MaterialCommunityIcons name="instagram" size={30} color="#E1306C" />
        </Pressable>
        <Pressable onPress={() => Linking.openURL('https://linkedin.com/company/ukshati-technologies')} style={styles.socialIcon}>
          <MaterialCommunityIcons name="linkedin" size={30} color="#0077b5" />
        </Pressable>
        <Pressable onPress={() => Linking.openURL('https://facebook.com/yourpage')} style={styles.socialIcon}>
          <MaterialCommunityIcons name="facebook" size={30} color="#3b5998" />
        </Pressable>
      </View>
    </LinearGradient>
  );

  const CustomHeader = () => (
    <View style={styles.customHeaderContainer}>
      <Pressable onPress={openDrawer} style={styles.iconButton}>
        <Ionicons name="menu" size={26} color="#000" />
      </Pressable>

      <Image
        source={require('../../assets/images/logowithleaf.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Pressable onPress={handleLogout} style={styles.iconButton}>
        <Ionicons name="log-out-outline" size={26} color="#000" />
      </Pressable>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={90}
      drawerPosition="left"
      renderNavigationView={DrawerContent}
    >
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            header: () => (
              <View>
                <GradientHeaderBackground />
                <CustomHeader />
              </View>
            ),
          }}
        >
          <Stack.Screen name="Landing" />
          <Stack.Screen name="NotificationsScreen" options={{ title: 'Notifications' }} />
          <Stack.Screen name="AboutUsScreen" options={{ title: 'About Us' }} />
          <Stack.Screen name="ContactScreen" options={{ title: 'Contact' }} />
          <Stack.Screen name="Queries" options={{ title: 'Queries' }} />
        </Stack>
      </View>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  customHeaderContainer: {
    height: 110,
    paddingTop: 35,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconButton: {
    padding: 6,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  drawer: {
    flex: 1,
    paddingVertical: 120,
    paddingHorizontal: 15,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    alignItems: 'center',
  },
  drawerItem: {
    marginVertical: 10,
  },
  socialContainer: {
    marginTop: 'auto',
    marginBottom: 16,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  socialIcon: {
    marginVertical: 4,
  },
});
