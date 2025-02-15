
import { View, Text, Pressable, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

export default function Screen1() {
  const router = useRouter();
  const [nodes, setNodes] = useState<{ node_id: number; name: string }[]>([]); // State to store fetched nodes
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/nodes`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        setNodes(data);
      } catch (error) {
        console.error('Error fetching nodes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  const handleNodePress = async (node_id: number) => {
    try {
      await AsyncStorage.setItem('selectedNodeId', node_id.toString()); // Store node_id in AsyncStorage
      console.log(`Stored node_id: ${node_id}`);
      router.push(`./quadra_screens/screen2?id=${node_id}`);
    } catch (error) {
      console.error('Error saving node_id to AsyncStorage:', error);
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
              key={node.node_id}
              style={styles.nodeButton}
              onPress={() => handleNodePress(node.node_id)}
            >
              <Text style={styles.nodeText}>{node.name}</Text>
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


