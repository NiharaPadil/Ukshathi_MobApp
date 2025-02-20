
//dont remove commentsssss

import { View, Text, Pressable, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

export default function Screen1() {
  type NodeType = {
        nodeID: string | number;
        nodeName: string;
        batteryVoltage: number;
      };
  const router = useRouter();
  const [nodes, setNodes] = useState<NodeType[]>([]); // State to store fetched nodes
  const [loading, setLoading] = useState(true); // Loading state
  //uncomment durig dynamic fetch
  // const [userID, setUserID] = useState<string | null>(null);  // Store userID

  //comment dduring dynsmic fecth
  const userID = "8";

  //uncomment dduring ynamic fetch

    // useEffect(() => {
  //   const fetchUserID = async () => {
  //     try {
  //       const storedUserID = await AsyncStorage.getItem('userID'); // Retrieve stored userID
  //       if (storedUserID) {
  //         setUserID(storedUserID);
  //         fetchNodes(storedUserID);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching userID:', error);
  //     }
  //   };

  //   fetchUserID();
  // }, []);

  //coomnet when dynamic id u fetch
  useEffect(() => {
    fetchNodes(userID);
  }, []);

  const fetchNodes = async (userID: string) => {
    try {
      //use storeduserid during dynamic fetch
      const response = await fetch(`${API_BASE_URL}/nodes?userID=${userID}`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const data: NodeType[] = await response.json();
      setNodes(data);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodePress = async (nodeID:string | number) => {
    try {
      await AsyncStorage.setItem('selectedNodeId', nodeID.toString());
      console.log(`Stored nodeID: ${nodeID}`);
      router.push(`./quadra_screens/screen2?id=${nodeID}`);
    } catch (error) {
      console.error('Error saving nodeID:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Nodes</Text>
      </View>

      {/* USER INFO */}
      <View style={styles.userInfo}>
        <Text style={styles.userText}>Hello User</Text>
        <Image source={require('../assets/images/Uno.jpg')} style={styles.userImage} />
      </View>

      {/* NODE LIST */}
      <View style={styles.nodeList}>
        {loading ? (
          <ActivityIndicator size="large" color="#03A9F4" />
        ) : (
          nodes.map((node) => (
            <Pressable
              key={node.nodeID}
              style={styles.nodeButton}
              onPress={() => handleNodePress(node.nodeID)}
            >
              <Text style={styles.nodeText}>{node.nodeName}</Text>
            </Pressable>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
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
    alignContent: 'center',
    alignItems: 'center',
  },
  userText: {
    fontSize: 24,
    marginRight: 10,
  },
  userImage: {
    width: 74,
    height: 74,
  },
  nodeList: {
    marginTop: 100,
  },
  nodeButton: {
    backgroundColor: '#1e7218',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
  },
  nodeText: {
    color: '#fff',
    fontSize: 18,
  },
});

