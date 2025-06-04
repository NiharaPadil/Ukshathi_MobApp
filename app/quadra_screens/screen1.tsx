import { View, Text, Pressable, Image, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { globalStyles } from '../../style';
import BackgroundImage from '../../components_ad/Background';
import BackButton from '../../components_ad/BackButton';

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
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState<string | null>(null);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 35,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const storedUserID = await AsyncStorage.getItem('userID');
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

  const handleNodePress = (nodeID: string | number) => {
    router.push({ pathname: './screen2', params: { id: nodeID } });
  };

  const groupedNodes: Record<string, NodeType[]> = nodes.reduce((acc, node) => {
    const controllerID = String(node.controllerID);
    if (!acc[controllerID]) acc[controllerID] = [];
    acc[controllerID].push(node);
    return acc;
  }, {} as Record<string, NodeType[]>);

  const firstName = nodes.length > 0 ? nodes[0].firstName : '';
  const lastName = nodes.length > 0 ? nodes[0].lastName : '';

  return (
    <BackgroundImage>
      <View style={styles.container}>
        {/* Top-Left Back Button */}
        <View style={styles.topLeftButton}>
          <BackButton
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/Landing');
              }
            }}
          />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Nodes</Text>
        </View>

        {/* User Info with Wobble Animation */}
        <Animated.View
          style={[
            styles.userInfo,
            {
              transform: [
                {
                  translateX: shakeAnim,
                },
              ],
            },
          ]}
        >
          <Text style={styles.userText}>
            Hello <Text style={{ fontWeight: 'bold' }}>{firstName} {lastName}</Text> !
          </Text>
          <Image source={require('../../assets/images/Quadra.jpg')} style={styles.userImage} />
        </Animated.View>

        {/* Node List */}
        <View style={styles.nodeList}>
          {loading ? (
            <ActivityIndicator size="large" color="#03A9F4" />
          ) : (
            Object.keys(groupedNodes).map((controllerID) => (
              <View key={controllerID}>
                <Text style={styles.controllerHeader}>Controller {controllerID}</Text>
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
    borderRadius: 37,
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
  topLeftButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 30,
    padding: 6,
  },
});
