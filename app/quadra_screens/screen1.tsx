//nodes screen with grouped controllers 
import { View, Text, Pressable, Image, ActivityIndicator, StyleSheet,ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../style';
import BackgroundImage from '../../components_ad/Background';


const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

export default function Screen1() {
  type NodeType = {
    nodeID: string | number;
    nodeName: string;
    batteryVoltage: number;
    controllerID: string;
    firstName: string;
    lastName: string;
  };

  const router = useRouter();
  const [nodes, setNodes] = useState<NodeType[]>([]); // State to store fetched nodes
  const [loading, setLoading] = useState(true); // Loading state
  const [userID, setUserID] = useState<string | null>(null); // Store userID

  // Fetch userID from AsyncStorage
  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const storedUserID = await AsyncStorage.getItem('userID'); // Retrieve stored userID
        if (storedUserID) {
          setUserID(storedUserID);
          fetchNodes(storedUserID);
        }
      } catch (error) {
        console.error('Error fetching userID:', error);
      }
    };

    fetchUserID();
  }, []);

  // Fetch nodes from API
  const fetchNodes = async (userID: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/device/nodes?userID=${userID}`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const data: NodeType[] = await response.json();
      setNodes(data);
      console.log('Fetched nodes:', data);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle node press
  const handleNodePress = (nodeID: string | number) => {
    router.push({ pathname: './screen2', params: { id: nodeID } });
  };

  // Group nodes by controllerID
  const groupedNodes: Record<string, NodeType[]> = nodes.reduce((acc, node) => {
    const controllerID = String(node.controllerID); // Ensure controllerID is a string
    if (!acc[controllerID]) acc[controllerID] = [];
    acc[controllerID].push(node);
    return acc;
  }, {} as Record<string, NodeType[]>);

  // Get the first node's firstName and lastName (if available)
  const firstName = nodes.length > 0 ? nodes[0].firstName : '';
  const lastName = nodes.length > 0 ? nodes[0].lastName : '';

  return (
    <BackgroundImage>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Nodes</Text>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.userText}>Hello <Text style={{ fontWeight: 'bold' }}>{firstName} {lastName}</Text> !</Text>
        <Image source={require('../../assets/images/Quadra.jpg')} style={styles.userImage} />
      </View>

      {/* Node List */}
      <View style={styles.nodeList}>
        {loading ? (
          <ActivityIndicator size="large" color="#03A9F4" />
        ) : (
          Object.keys(groupedNodes).map((controllerID) => (
            <View key={controllerID}>
              {/* Show Controller ID as Section Header */}
              <Text style={styles.controllerHeader}>Controller {controllerID}</Text>

              {/* Display Nodes Under Each Controller */}
              {groupedNodes[controllerID].map((node) => (
                <Pressable
                  key={node.nodeID}
                  style={globalStyles.Button}
                  onPress={() => handleNodePress(node.nodeID)}
                >
                  <Text style={globalStyles.Text}>{node.nodeName}</Text>
                </Pressable>
              ))}
            </View>
          ))
        )}
      </View>

      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => router.push('/')}>
        <Ionicons name="arrow-back" size={40} color="#337a2c" />
      </Pressable>
    </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 20,
    alignItems: 'center',
    elevation: 4,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  userInfo: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    fontSize: 24,
    marginRight: 10,
  },
  userImage: {
    width: 74,
    height: 74,
    borderRadius: 37, // Make the image circular
  },
  controllerHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  nodeList: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  }, 
  backButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    padding: 10,
  },
});