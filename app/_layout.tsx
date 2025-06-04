// /app/_layout.tsx
import React, { useRef } from 'react';
import { DrawerLayoutAndroid, View, Pressable, StyleSheet, Linking } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

      {/* Social icons */}
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

  // Add a simple header with menu button here:
  const Header = () => (
    <View style={styles.header}>
      <Pressable onPress={openDrawer} style={styles.menuButton}>
        <Ionicons name="menu" size={30} color="#000" />
      </Pressable>
      {/* You can add a title or logo here if you want */}
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={100}
      drawerPosition="left"
      renderNavigationView={isIndex ? () => <View /> : renderDrawerContent}
    >
      <View style={styles.container}>
        <Header />
        <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="Register" />
          <Stack.Screen name="Landing" />
          <Stack.Screen name="NotificationsScreen" />
          <Stack.Screen name="AboutUsScreen" />
          <Stack.Screen name="ContactScreen" />
          <Stack.Screen name="Queries" />
          <Stack.Screen name="quadra_screens/screen1" options={{ title: 'Quadra Screen 1' }} />
          <Stack.Screen name="quadra_screens/screen2" options={{ title: 'Quadra Screen 2' }} />
          <Stack.Screen name="quadra_screens/screen3" options={{ title: 'Quadra Screen 3' }} />
        </Stack>
      </View>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  socialIcon: {
    marginVertical: 4,
  },
  header: {
    height: 50,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 4,
  },
  menuButton: {
    width: 40,
    justifyContent: 'center',
  },
});
