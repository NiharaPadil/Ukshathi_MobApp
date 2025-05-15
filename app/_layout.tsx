import React, { useRef } from 'react';
import { DrawerLayoutAndroid, View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
      colors={['#4CAF50', '#A8D5BA', '#E6F2E6', '#ffffff']} // leaf green to white gradient
      style={styles.drawer}
    >
      <Text style={styles.drawerTitle}>☰</Text>

      <Pressable onPress={() => navigateTo('/NotificationsScreen')} style={styles.drawerItem}>
        <MaterialCommunityIcons name="bell-outline" size={24} color="#000" />
      </Pressable>
      <Pressable onPress={() => navigateTo('/AboutUsScreen')} style={styles.drawerItem}>
        <MaterialCommunityIcons name="information-outline" size={24} color="#000" />
      </Pressable>
      <Pressable onPress={() => navigateTo('/ContactScreen')} style={styles.drawerItem}>
        <MaterialCommunityIcons name="phone-outline" size={24} color="#000" />
      </Pressable>
      <Pressable onPress={() => navigateTo('/Queries')} style={styles.drawerItem}>
        <MaterialCommunityIcons name="chat-question-outline" size={24} color="#000" />
      </Pressable>

      <View style={styles.socialContainer}>
        <Pressable onPress={() => Linking.openURL('https://instagram.com/yourpage')}>
          <MaterialCommunityIcons name="instagram" size={22} color="#E1306C" />
        </Pressable>
        <Pressable onPress={() => Linking.openURL('https://linkedin.com/company/ukshati-technologies')}>
          <MaterialCommunityIcons name="linkedin" size={22} color="#0077b5" />
        </Pressable>
        <Pressable onPress={() => Linking.openURL('https://facebook.com/yourpage')}>
          <MaterialCommunityIcons name="facebook" size={22} color="#3b5998" />
        </Pressable>
      </View>
    </LinearGradient>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={100}
      drawerPosition="left"
      renderNavigationView={isIndex ? () => <View /> : renderDrawerContent}
    >
      <View style={styles.container}>
        {!isIndex && (
          <Pressable onPress={openDrawer} style={styles.menuButton}>
            <Text style={styles.menuText}>☰</Text>
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
  menuButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    elevation: 4,
    margin: 10,
    position: "absolute",
    top: 100,
    left: 20,
    zIndex: 1,
  },
  menuText: { fontSize: 20, fontWeight: 'bold' },
  drawer: {
    flex: 1,
    paddingVertical: 70,
    alignItems: "center",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  drawerItem: {
    marginVertical: 15,
    alignItems: "center",
  },
  socialContainer: {
    marginTop: 'auto',
    marginBottom: 10,
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
});
