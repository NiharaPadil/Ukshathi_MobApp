//screem2.tsx:
//WARNING DONT REMOVE ANY COMMNETS

import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { useLocalSearchParams } from 'expo-router';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';


export default function Screen2() {
  //Using params
  const params = useLocalSearchParams();
const [nodeId, setNodeId] = useState<string | null>(Array.isArray(params.id) ? params.id[0] : params.id); //thru paramss

  const [valves, setValves] = useState<{ valveID: number; nodeID: number; valveName  : string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batteryVoltage, setBatteryVoltage] = useState<string | null>(null); 
  const [flowRate, setFlowRate] = useState<string | null>(null);
  

//WARNING:DONT REMOVE THIS COMMNETS:

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const getNodeId = async () => {
  //       const storedNodeId = await AsyncStorage.getItem('selectedNodeId');
  //       console.log('Retrieved Node ID:', storedNodeId);
  //       setNodeId(storedNodeId);
  //     };
  //     getNodeId();
  //   }, [])
  // );

  

  // Fetch valves data based on nodeId
  useEffect(() => {
    if (!nodeId) return; // Wait for nodeId before making API call
    const fetchValves = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/nodes/${nodeId}/valves`);
        if (!response.ok) {
          throw new Error('Failed to fetch valves');
        }
        const data = await response.json();
        console.log("Fetched Valves Data:", data);
        setValves(data);
      } catch (err) {
        console.error("Error fetching valves:", err);
        setError('Failed to fetch valves');
      } finally {
        setLoading(false);
      }
    };
    fetchValves();
  }, [nodeId]);


  //fetch battery volatege
  useEffect(() => {
    if (!nodeId) return; // Wait for nodeId before making API call

    const fetchBatteryVoltage = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/battery/${nodeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch battery voltage');
        }
        const data = await response.json();
        console.log("Fetched Battery Voltage:", data);
        setBatteryVoltage(data.batteryVoltage.toString() + "V"); 
      } catch (err) {
        console.error("Error fetching battery voltage:", err);
        setBatteryVoltage("N/A"); 
      }
    };

    fetchBatteryVoltage();
  }, [nodeId]);


  //fetch flowrate/flowmetere
  useEffect(() => {
    if (!nodeId) return;
    const fetchFlowRate = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/flowmeter/${nodeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch flow rate');
        }
        const data = await response.json();
        console.log("Fetched Flow Rate:", data);
        setFlowRate(data.flowRate ? `${data.flowRate} L/min` : "N/A");
      } catch (err) {
        console.error("Error fetching flow rate:", err);
        setFlowRate("N/A");
      }
    };
    fetchFlowRate();
  }, [nodeId]);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Valves for Node {nodeId || '...'}</Text>
      </View>

      {!nodeId ? (
        <ActivityIndicator size="large" color="#03A9F4" style={styles.loader} />
      ) : loading ? (
        <ActivityIndicator size="large" color="#03A9F4" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.valveContainer}>
            <Text style={styles.sectionTitle}>Valves</Text>
            {valves.length > 0 ? (
              valves.map((valve, index) => (
                <Pressable
                  key={index}
                  style={styles.valveButton}
                  onPress={() => router.push({ pathname: '/quadra_screens/screen3', params: { id: valve.valveID } })}
                >
                  <Text style={styles.valveText}>{valve.valveName}</Text>
                </Pressable>
              ))
            ) : (
              <Text style={styles.noDataText}>No valves available for this node.</Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Flow Meter</Text>
              <Text style={styles.infoValue}>Value: {flowRate || "Loading..."}</Text> 
            </View>
            <View style={[styles.infoBox, styles.batteryBox]}>
              <Text style={styles.infoTitle}>Battery Voltage</Text>
              <Text style={styles.infoValue}>Value: {String(batteryVoltage || "Loading...")}</Text>
{/* Updated */}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  
  },
  header: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 10,
    alignItems: 'center',
    elevation: 4,
    marginTop: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginTop: 80,
  },
  valveContainer: {
    flex: 1,
    padding: 10,
    marginRight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  valveButton: {
    backgroundColor: '#809c13',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  valveText: {
    color: '#fff',
    fontSize: 16,
  },
  noDataText: {
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    width: '80%',
  },
  batteryBox: {
    backgroundColor: '#FF5722',
  },
  infoTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
});
