
import { Stack } from 'expo-router';
import { Image, View } from 'react-native';

export default function PagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
      }}
    >
      <Stack.Screen
        name="Landing"
        options={{
          headerTitle: () => (
            <View style={{ paddingLeft: 10 }}>
              <Image
                source={require('../../assets/images/logowithleaf.png')} // ensure path is correct
                style={{
                  width: 70,
                  height: 70,
                  backgroundColor: '#4CAF50', // match background if logo has white edges
                  borderRadius: 10,
                }}
                resizeMode="contain"
              />
            </View>
          ),
          headerTitleAlign: 'left',
        }}
      />
      
      <Stack.Screen name="NotificationsScreen" options={{ title: 'Notifications', headerTitleAlign: 'center' }} />
      <Stack.Screen name="AboutUsScreen" options={{ title: 'About Us', headerTitleAlign: 'center' }} />
      <Stack.Screen name="ContactScreen" options={{ title: 'Contact', headerTitleAlign: 'center' }} />
      <Stack.Screen name="Queries" options={{ title: 'Queries', headerTitleAlign: 'center' }} />
    </Stack>
  );
}
