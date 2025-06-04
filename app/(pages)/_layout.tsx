// /app/(pages)/_layout.tsx
// app/(pages)/_layout.tsx
import React, { useRef } from 'react';
import {
  DrawerLayoutAndroid,
  View,
  Pressable,
  Image,
  Alert,
  StyleSheet,
  Linking,
  Text,
} from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Layout() {
  const drawerRef = useRef<DrawerLayoutAndroid>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isIndex = pathname === '/';

  const openDrawer = () => {
    if (drawerRef.current) {
      drawerRef.current.openDrawer();
    }
  };

  const closeDrawer = () => {
    if (drawerRef.current) {
      drawerRef.current.closeDrawer();
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/');
    } catch (error) {
      Alert.alert('Logout Failed');
    }
  };

  const navigateTo = (route: string) => {
    router.push(route as any);
    closeDrawer();
  };

  const DrawerContent = () => (
    <LinearGradient
      colors={['#4CAF50', '#A8D5BA', '#E6F2E6', '#ffffff']}
      style={styles.drawer}
    >
      {[
        { icon: 'home-outline', label: 'Landing', route: '/Landing' },
        { icon: 'bell-outline', label: 'Notifications', route: '/NotificationsScreen' },
        { icon: 'information-outline', label: 'About Us', route: '/AboutUsScreen' },
        { icon: 'phone-outline', label: 'Contact', route: '/ContactScreen' },
        { icon: 'chat-question-outline', label: 'Queries', route: '/Queries' },
      ].map(({ icon, label, route }, index) => (
        <Pressable key={index} onPress={() => navigateTo(route)} style={styles.drawerItem}>
          <MaterialCommunityIcons name={icon as any} size={36} color="#000" />
          <Text style={styles.drawerText}>{label}</Text>
        </Pressable>
      ))}

      <View style={styles.socialContainer}>
        <Pressable onPress={() => Linking.openURL('https://instagram.com/yourpage')}>
          <MaterialCommunityIcons name="instagram" size={30} color="#E1306C" />
        </Pressable>
        <Pressable onPress={() => Linking.openURL('https://linkedin.com/company/ukshati-technologies')}>
          <MaterialCommunityIcons name="linkedin" size={30} color="#0077b5" />
        </Pressable>
        <Pressable onPress={() => Linking.openURL('https://facebook.com/yourpage')}>
          <MaterialCommunityIcons name="facebook" size={30} color="#3b5998" />
        </Pressable>
      </View>
    </LinearGradient>
  );

  const GradientHeaderBackground = () => (
    <LinearGradient
      colors={['#4CAF50', '#ffffff', '#4CAF50']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={StyleSheet.absoluteFill}
    />
  );

  const CustomHeader = () => (
    <View style={styles.customHeaderContainer}>
      <Pressable onPress={openDrawer} style={styles.iconButton}>
        <Ionicons name="menu" size={26} color="#000" />
      </Pressable>

      <Image
        source={require('../../assets/images/logowithleaf.png')} // ✅ Corrected path
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
      drawerWidth={220}
      drawerPosition="left"
      renderNavigationView={isIndex ? () => <View /> : DrawerContent}
    >
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            header: isIndex ? undefined : () => (
              <View>
                <GradientHeaderBackground />
                <CustomHeader />
              </View>
            ),
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="Register" />
          <Stack.Screen name="Landing" />
          <Stack.Screen name="NotificationsScreen" />
          <Stack.Screen name="AboutUsScreen" />
          <Stack.Screen name="ContactScreen" />
          <Stack.Screen name="Queries" />
          <Stack.Screen name="quadra_screens/screen1" />
          <Stack.Screen name="quadra_screens/screen2" />
          <Stack.Screen name="quadra_screens/screen3" />
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
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  drawerText: {
    fontSize: 18,
    fontWeight: '500',
  },
  socialContainer: {
    marginTop: 'auto',
    gap: 10,
    marginBottom: 30,
  },
});
