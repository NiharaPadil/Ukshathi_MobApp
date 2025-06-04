// /app/_layout.tsx
import React, { useRef } from 'react';
import {
  DrawerLayoutAndroid,
  View,
  Pressable,
  StyleSheet,
  Linking,
  Platform,
  StatusBar,
} from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 24,
    paddingHorizontal: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 2,
  },
  menuButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 24,
    left: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  socialIcon: {
    marginHorizontal: 8,
  },
});

export default function Layout() {
  const router = useRouter();
  const pathname = usePathname();
  const drawerRef = useRef<DrawerLayoutAndroid>(null);

  const isIndex = pathname === '/';

  const openDrawer = () => drawerRef.current?.openDrawer();
  const closeDrawer = () => drawerRef.current?.closeDrawer();

  const navigateTo = (route: string) => {
    router.push(route as any);
    closeDrawer();
  };

  const renderDrawerContent = () => (
    <LinearGradient
      colors={['#4CAF50', '#A8D5BA', '#E6F2E6', '#ffffff']}
      style={styles.drawer}
    >
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

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={120}
      drawerPosition="left"
      renderNavigationView={isIndex ? () => <View /> : renderDrawerContent}
    >
      <View style={styles.container}>
        {/* Floating Drawer Button (hidden on index) */}
        {!isIndex && (
          <Pressable onPress={openDrawer} style={styles.menuButton}>
            <MaterialCommunityIcons name="menu" size={28} color="#000" />
          </Pressable>
        )}

        <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="Register" />
          <Stack.Screen name="Landing" />
          <Stack.Screen name="NotificationsScreen" />
          <Stack.Screen name="AboutUsScreen" />
          <Stack.Screen name="ContactScreen" />
        </Stack>
      </View>
    </DrawerLayoutAndroid>
  );
}
