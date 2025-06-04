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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 24,
    paddingHorizontal: 10,
  },
  drawerInner: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerSection: {
    alignItems: 'center',
    marginTop: 60,
  },
  drawerItem: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    position: 'absolute',
    top: (Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 24) + 12,
    left: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 10,
    shadowRadius: 2,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
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
      <View style={styles.drawerInner}>
        {/* Navigation Icons */}
        <View style={styles.drawerSection}>
          <Pressable onPress={() => navigateTo('/Landing')} style={styles.drawerItem}>
            <MaterialCommunityIcons name="home-outline" size={40} color="#000" />
          </Pressable>

          <Pressable onPress={() => navigateTo('/NotificationsScreen')} style={styles.drawerItem}>
            <MaterialCommunityIcons name="bell-outline" size={40} color="#000" />
          </Pressable>

          <Pressable onPress={() => navigateTo('/AboutUsScreen')} style={styles.drawerItem}>
            <MaterialCommunityIcons name="information-outline" size={40} color="#000" />
          </Pressable>

          <Pressable onPress={() => navigateTo('/ContactScreen')} style={styles.drawerItem}>
            <MaterialCommunityIcons name="phone-outline" size={40} color="#000" />
          </Pressable>

          <Pressable onPress={() => navigateTo('/Queries')} style={styles.drawerItem}>
            <MaterialCommunityIcons name="chat-question-outline" size={40} color="#000" />
          </Pressable>
        </View>

        {/* Social Media Icons at Bottom */}
        <View style={styles.socialIconsContainer}>
          <Pressable
            onPress={() => Linking.openURL('https://instagram.com/yourpage')}
            style={styles.drawerItem}
          >
            <MaterialCommunityIcons name="instagram" size={40} color="#E1306C" />
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL('https://linkedin.com/company/ukshati-technologies')}
            style={styles.drawerItem}
          >
            <MaterialCommunityIcons name="linkedin" size={40} color="#0077b5" />
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL('https://facebook.com/yourpage')}
            style={styles.drawerItem}
          >
            <MaterialCommunityIcons name="facebook" size={40} color="#3b5998" />
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={160} // reduced drawer width
      drawerPosition="left"
      renderNavigationView={isIndex ? () => <View /> : renderDrawerContent}
    >
      <View style={styles.container}>
        {!isIndex && (
          <Pressable onPress={openDrawer} style={styles.menuButton} accessibilityLabel="Open menu">
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
          <Stack.Screen name="Queries" />
        </Stack>
      </View>
    </DrawerLayoutAndroid>
  );
}
