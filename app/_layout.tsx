

// import React, { useRef } from 'react';
// import { DrawerLayoutAndroid, View, Text, Pressable, StyleSheet, Linking } from 'react-native';
// import { Stack, useRouter } from 'expo-router';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

// export default function Layout() {
//   const router = useRouter();
//   const drawerRef = useRef<DrawerLayoutAndroid>(null);

//   const openDrawer = () => {
//     if (drawerRef.current) {
//       drawerRef.current.openDrawer();
//     }
//   };

//   const closeDrawer = () => {
//     if (drawerRef.current) {
//       drawerRef.current.closeDrawer();
//     }
//   };

//   // Navigation function that pushes the route and then closes the drawer
//   const navigateTo = (route: string) => {
//     router.push(route as any);
//     closeDrawer();
//   };

//   return (
//     <DrawerLayoutAndroid
//       ref={drawerRef}
//       drawerWidth={160}
//       drawerPosition="left"
//       renderNavigationView={() => (
//         <View style={styles.drawer}>
//           <Text style={styles.drawerTitle}>Menu</Text>
//           <Pressable onPress={() => navigateTo('/Landing')} style={styles.drawerItem}>
//             <Text style={styles.text}>Landing</Text>
//           </Pressable>
//           <Pressable onPress={() => navigateTo('/NotificationsScreen')} style={styles.drawerItem}>
//             <Text style={styles.text}>Notifications</Text>
//           </Pressable>
//           <Pressable onPress={() => navigateTo('/AboutUsScreen')} style={styles.drawerItem}>
//             <Text style={styles.text}>About Us</Text>
//           </Pressable>
//           <Pressable onPress={() => navigateTo('/ContactScreen')} style={styles.drawerItem}>
//             <Text style={styles.text}>Contact</Text>
//           </Pressable>
//           <Pressable onPress={() => navigateTo('/Queries')} style={styles.drawerItem}>
//             <Text style={styles.text}>Queries</Text>
//           </Pressable>


//           {/* Social Media Icons */}
//       <View style={styles.socialContainer}>
//         <Pressable 
//           onPress={() => Linking.openURL('https://www.linkedin.com/company/ukshati-technologies/posts/?feedView=all')}
//           style={styles.socialIcon}
//         >
//           <MaterialCommunityIcons name="instagram" size={24} color="#E1306C" />
//         </Pressable>
//         <Pressable 
//           onPress={() => Linking.openURL('https://www.linkedin.com/company/ukshati-technologies/posts/?feedView=all')}
//           style={styles.socialIcon}
//         >
//           <MaterialCommunityIcons name="linkedin" size={24} color="#0077b5" />
//         </Pressable>
//         <Pressable 
//           onPress={() => Linking.openURL('https://www.linkedin.com/company/ukshati-technologies/posts/?feedView=all')}
//           style={styles.socialIcon}
//         >
//           <MaterialCommunityIcons name="facebook" size={24} color="#3b5998" />
//         </Pressable>
//       </View>

//         </View>
//       )}
//     >
//       <View style={styles.container}>
        
//         {/* Menu button to open the drawer */}
//         <Pressable onPress={openDrawer} style={styles.menuButton}>
//           <Text style={styles.menuText}>☰</Text>
//         </Pressable>
//         <Stack
//           initialRouteName="index"
//           screenOptions={{
//             headerShown: false, // Hide the header for all screens
//           }}
//         >
//           <Stack.Screen name="index" options={{ title: "Index" }} />
//           <Stack.Screen name="Landing" options={{ title: "Landing" }} />
//           <Stack.Screen name="Register" options={{ title: "Register" }} />
//           <Stack.Screen name="quadra_screens/screen1" options={{ title: "Quadra Screen 1", headerShown: false }} />
//           <Stack.Screen name="quadra_screens/screen2" options={{ title: "Quadra Screen 2" ,headerShown: false}} />
//           <Stack.Screen name="quadra_screens/screen3" options={{ title: "Quadra Screen 3" ,headerShown: false}} />
//           <Stack.Screen name="NotificationsScreen" options={{ title: "Notifications" }} />
//           <Stack.Screen name="AboutUsScreen" options={{ title: "About Us" }} />
//           <Stack.Screen name="ContactScreen" options={{ title: "Contact" }} />

//         </Stack>
//       </View>
//     </DrawerLayoutAndroid>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   menuButton: {
//     padding: 10,
//     backgroundColor: "#ddd",
//     borderRadius: 5,
//     margin: 10,
//     position: "absolute",
//     top: 10,
//     left: 20,
//     zIndex: 1,
//   },
//   menuText: { fontSize: 15, },
//   drawer: { flex: 1, backgroundColor: "#98b289", padding: 20,margin:10, borderRadius: 30},
//   drawerTitle: { fontSize: 25, fontWeight: "bold", marginBottom: 20 ,textDecorationLine: "underline"},
//   drawerItem: { marginBottom: 18},
//   text: { fontSize: 16 ,fontWeight: "bold"},
//   socialContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 600 },
//   socialIcon: { padding: 0, borderRadius: 5, backgroundColor: "#98b289" },
// });



import React, { useRef } from 'react';
import { DrawerLayoutAndroid, View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    <View style={styles.drawer}>
      <Text style={styles.drawerTitle}>Menu</Text>
      <Pressable onPress={() => navigateTo('/Landing')} style={styles.drawerItem}>
        <Text style={styles.text}>Landing</Text>
      </Pressable>
      <Pressable onPress={() => navigateTo('/NotificationsScreen')} style={styles.drawerItem}>
        <Text style={styles.text}>Notifications</Text>
      </Pressable>
      <Pressable onPress={() => navigateTo('/AboutUsScreen')} style={styles.drawerItem}>
        <Text style={styles.text}>About Us</Text>
      </Pressable>
      <Pressable onPress={() => navigateTo('/ContactScreen')} style={styles.drawerItem}>
        <Text style={styles.text}>Contact</Text>
      </Pressable>
      <Pressable onPress={() => navigateTo('/Queries')} style={styles.drawerItem}>
        <Text style={styles.text}>Queries</Text>
      </Pressable>

      <View style={styles.socialContainer}>
        <Pressable 
          onPress={() => Linking.openURL('https://linkedin.com/company/ukshati-technologies')}
          style={styles.socialIcon}
        >
          <MaterialCommunityIcons name="instagram" size={24} color="#E1306C" />
        </Pressable>
        <Pressable 
          onPress={() => Linking.openURL('https://linkedin.com/company/ukshati-technologies')}
          style={styles.socialIcon}
        >
          <MaterialCommunityIcons name="linkedin" size={24} color="#0077b5" />
        </Pressable>
        <Pressable 
          onPress={() => Linking.openURL('https://linkedin.com/company/ukshati-technologies')}
          style={styles.socialIcon}
        >
          <MaterialCommunityIcons name="facebook" size={24} color="#3b5998" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={160}
      drawerPosition="left"
      drawerLockMode={isIndex ? 'locked-closed' : 'unlocked'}
      renderNavigationView={isIndex ? () => <View /> : renderDrawerContent}
    >
      <View style={styles.container}>
        {!isIndex && (
          <Pressable onPress={openDrawer} style={styles.menuButton}>
            <Text style={styles.menuText}>☰</Text>
          </Pressable>
        )}

        <Stack
          initialRouteName="index"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="Landing" />
          <Stack.Screen name="Register" />
          <Stack.Screen 
            name="quadra_screens/screen1" 
            options={{ title: "Quadra Screen 1" }} 
          />
          <Stack.Screen 
            name="quadra_screens/screen2" 
            options={{ title: "Quadra Screen 2" }} 
          />
          <Stack.Screen 
            name="quadra_screens/screen3" 
            options={{ title: "Quadra Screen 3" }} 
          />
          <Stack.Screen name="NotificationsScreen" />
          <Stack.Screen name="AboutUsScreen" />
          <Stack.Screen name="ContactScreen" />
        </Stack>
      </View>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  menuButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    margin: 10,
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 1,
  },
  menuText: { fontSize: 15 },
  drawer: { 
    flex: 1, 
    backgroundColor: "#98b289", 
    padding: 20,
    margin: 10, 
    borderRadius: 30
  },
  drawerTitle: { 
    fontSize: 25, 
    fontWeight: "bold", 
    marginBottom: 20,
    textDecorationLine: "underline" 
  },
  drawerItem: { marginBottom: 18 },
  text: { 
    fontSize: 16,
    fontWeight: "bold" 
  },
  socialContainer: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginTop: 'auto',
    paddingVertical: 20 
  },
  socialIcon: { 
    padding: 8, 
    borderRadius: 5 
  },
});