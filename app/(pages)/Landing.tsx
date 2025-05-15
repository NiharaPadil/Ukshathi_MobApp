import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Background from '../../components_ad/Background';

export default function LandingScreen() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [userProducts, setUserProducts] = useState([]);
  const [userId, setUserId] = useState('');

  
  const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';


  // Fetch user data when the component mounts and set userId and name
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userID');
        const storedName = await AsyncStorage.getItem('name');
        if (!storedUserId) {
          console.error('No user_id found in storage');
          Alert.alert('Error', 'User ID not found. Please login again.');
          return;
        }
        setUserId(storedUserId);
        console.log('Retrieved user_id:', storedUserId);

        //get how many controllers the user has 
        const response = await fetch(`${API_BASE_URL}/device/controller/${storedUserId}`);
        const data = await response.json();
        console.log('User products:', data);
        setUserProducts(data);
      } catch (error) {
        console.error('Error fetching user products:', error);
      }
    };

    fetchUserData();
  }, []);


  //logout function, this function will be called when the user clicks the logout button
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  // Check if the user has any products and set permissions accordingly
  const userPermissions: string[] = userProducts;
  console.log('User permissions:', userPermissions);

  const items = [
    {
      name: 'Uno',
      desc: 'A single valve system for precise, Wifi/4G-enabled watering of up to 100 plants, all in a weatherproof IP65 design',
      route: '/quadra_screens/screen1',//change the route to the correct one
      image: require('../../assets/images/Uno.jpg')
    },
    {
      name: 'Quadra',
      desc: 'QUADRA revolutionizes large-scale irrigation with solar-powered nodes managing up to 4 valves, compatible with various methods, and featuring LoRa® technology for precise wireless control via Wi-Fi or 4G in a durable IP65 design.',
      route: '/quadra_screens/screen1',
      image: require('../../assets/images/Quadra.jpg'),
    },
    {
      name: 'Hexa',
      desc: 'A sleek hexagonal tank with smart scheduling, designed for balconies without taps, integrates with RO units and AC compressors, and offers Wi-Fi/4G connectivity in an IP65 weatherproof build.',
      route: '/quadra_screens/screen1',//change the route to the correct one
      image: require('../../assets/images/Hexa.jpg'),
    },
    {
      name: 'Octa',
      desc: 'Manage up to 8 valves with precision scheduling, perfect for large outdoor spaces, and connect via Wi-Fi or 4G in a rugged, IP65 weatherproof design, ensuring your garden thrives effortlessly.',
      route: '/quadra_screens/screen1',// change the route to the correct one
      image: require('../../assets/images/Octa.jpg'),
    },
  ];

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.titcontainer}>
          <Text style={[styles.title, { left:35,top:-15 }]}>Welcome</Text>

            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>

          <View style={styles.box}>
            {items.map((item) => {
              const isDisabled = !userPermissions.includes(item.name);
              console.log('Item:', item.name, 'Disabled:', isDisabled);

              return (
                <Pressable
                  key={item.name}
                  onPress={() => !isDisabled && router.push(item.route as any)}
                  onPressIn={() => !isDisabled && setHovered(item.name)}
                  onPressOut={() => setHovered(null)}
                  style={[styles.item, isDisabled && styles.disabledItem, hovered === item.name && styles.hoveredItem]}
                >
                  <View style={styles.imageContainer}>
                    <Image source={item.image} style={[styles.image, hovered === item.name && styles.imageZoom]} />
                  </View>
                  <Text style={[styles.title, isDisabled && styles.disabledText]}>{item.name}</Text>
                  <Text style={styles.desc}>{item.desc}</Text>
                  <Pressable
                    onPress={() => !isDisabled && router.replace(item.route as any)}
                    style={({ pressed }) => [styles.learnMore, pressed && styles.pressed, hovered === item.name && styles.buttonSlide]}
                  >
                    <Text style={styles.learnText}>Know More</Text>
                  </Pressable>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    
    </Background>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 50,
  },
  titcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  box: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  item: {
    padding: 20,
    backgroundColor: '#71BC78',
    borderRadius: 12,
    width: 300,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
  },
  hoveredItem: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  disabledItem: {
    backgroundColor: '#D0E1D6',
    opacity: 0.6,
  },
  imageContainer: {
    overflow: 'hidden',
    borderRadius: 10,
  },
  image: {
    width: 150,
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
  },
  imageZoom: {
    transform: [{ scale: 1.1 }],
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '000',
    fontFamily: 'Montserrat',
  },
  disabledText: {
    color: '#818181',
  },
  desc: {
    marginTop: 5,
    fontSize: 14,
    color: '000',
    lineHeight: 22,
    textAlign: 'center',
  },
  learnMore: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#00693E',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonSlide: {
    transform: [{ translateY: -5 }],
  },
  learnText: {
    color: '#FFF',
    fontSize: 14,
  },
  pressed: {
    backgroundColor: '#5E9473',
  },
  logoutButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#D9534F',
    borderRadius: 5,
    alignItems: 'center',
    width: 120,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});



