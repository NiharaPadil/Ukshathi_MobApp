
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import axios from 'axios';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';


export default function Screen2() {
  const [nodeId, setNodeId] = useState<string | null>(null);
  const [valves, setValves] = useState<{ valveID: number; nodeID: number; valveName  : string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
//Flowmweter and battery voltage
  const [flowMeter, setFlowMeter] = useState(0);
  const [batteryVoltage, setBatteryVoltage] = useState(0);
  const [selectedValveId, setSelectedValveId] = useState<number | null>(null);

  // Fetch node_id from AsyncStorage when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const getNodeId = async () => {
        const storedNodeId = await AsyncStorage.getItem('selectedNodeId');
        console.log('Retrieved Node ID:', storedNodeId);
        setNodeId(storedNodeId);
      };
      getNodeId();
    }, [])
  );

  // Fetch valves for the selected node
  // from here okay 
  useEffect(() => {
    if (!nodeId) return;
    const fetchValves = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/nodes/${nodeId}/valves`);
        console.log("Fetched Valves:", response.data);
        setValves(response.data);

        // Automatically select the first valve by default
        if (response.data.length > 0) {
          setSelectedValveId(response.data[0].valveID);
        }
      } catch (err) {
        console.error("Error fetching valves:", err);
        setError('Failed to fetch valves');
      } finally {
        setLoading(false);
      }
    };
    fetchValves();
  }, [nodeId]);


   // Fetch FlowMeter and Battery Voltage when a valve is selected
  useEffect(() => {
    if (!selectedValveId) return;

    const fetchData = async () => {
      try {
        const [flowResponse, batteryResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/flowmeter/${selectedValveId}`),
          axios.get(`${API_BASE_URL}/battery/${selectedValveId}`)
        ]);

        setFlowMeter(flowResponse.data.flowRate);
        setBatteryVoltage(batteryResponse.data.batteryVoltage);
        console.log("Flow Meter:", flowResponse.data.flowRate);
        console.log("Battery Voltage:", batteryResponse.data.batteryVoltage);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [selectedValveId]);


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
                  onPress={() => router.push('/quadra_screens/screen3')}
                >
                  <Text style={styles.valveText}>{valve.valveName}</Text>
                </Pressable>
              ))
            ) : (
              <Text style={styles.noDataText}>No valves available for this node.</Text>
            )}
          </View>



          {/* FlowMeter and Battery Voltage Section */}
          <View style={styles.infoContainer}>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Flow Meter</Text>
              <Text style={styles.infoValue}>
                Value: {flowMeter !== null ? `${flowMeter} L/min` : 'Loading...'}
              </Text>
            </View>

            <View style={[styles.infoBox, styles.batteryBox]}>
              <Text style={styles.infoTitle}>Battery Voltage</Text>
              <Text style={styles.infoValue}>
                Value: {batteryVoltage !== null ? `${batteryVoltage} V` : 'Loading...'}
              </Text>
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



