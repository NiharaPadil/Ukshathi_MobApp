import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet, Dimensions, Modal,ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../style';
import WavyHeader from '../../components_ad/WavyHeader';
import Background from "../../components_ad/Background";
import BatteryHealthGraph from '../../components_ad/BatteryHealthGraph'; // Import the BatteryHealthGraph component
import { LineChart } from "react-native-chart-kit"; // Import your graph library

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

export default function Screen2() {
  const params = useLocalSearchParams();
  const [nodeId, setNodeId] = useState<string | null>(Array.isArray(params.id) ? params.id[0] : params.id);
  const [valves, setValves] = useState<{ valveID: number; nodeID: number; valveName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batteryVoltage, setBatteryVoltage] = useState<string | null>(null);
  const [flowRate, setFlowRate] = useState<string | null>(null);
  const [fetchingFlowRate, setFetchingFlowRate] = useState(false);
  const [fetchingBatteryVoltage, setFetchingBatteryVoltage] = useState(false);
  const [showGraph, setShowGraph] = useState(false); // State to control graph visibility
  const [batteryData, setBatteryData] = useState<{ labels: string[], voltages: number[] }>({ labels: [], voltages: [] });

  const router = useRouter();

  // Fetch valves data based on nodeId
  useEffect(() => {
    if (!nodeId) return;
    const fetchValves = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/device/nodes/${nodeId}/valves`);
        if (!response.ok) throw new Error('Failed to fetch valves');
        const data = await response.json();
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

  // Fetch flow rate when the Flow Meter button is clicked
  const handleFetchFlowRate = async () => {
    if (!nodeId) return;
    setFetchingFlowRate(true);
    try {
      const response = await fetch(`${API_BASE_URL}/realtime/flowmeter/${nodeId}`);
      if (!response.ok) throw new Error('Failed to fetch flow rate');
      const data = await response.json();
      setFlowRate(data.flowRate ? `${data.flowRate} L/min` : "N/A");
    } catch (err) {
      console.error("Error fetching flow rate:", err);
      setFlowRate("N/A");
    } finally {
      setFetchingFlowRate(false);
    }
  };

  // Fetch battery voltage when the Battery Voltage button is clicked
  const handleFetchBatteryVoltage = async () => {
    if (!nodeId) return;
    setFetchingBatteryVoltage(true);
    try {
      const response = await fetch(`${API_BASE_URL}/realtime/battery/${nodeId}`);
      if (!response.ok) throw new Error('Failed to fetch battery voltage');
      const data = await response.json();
      setBatteryVoltage(data.batteryVoltage.toString() + "V");
    } catch (err) {
      console.error("Error fetching battery voltage:", err);
      setBatteryVoltage("N/A");
    } finally {
      setFetchingBatteryVoltage(false);
    }
  };


  // Fetch battery health data when the Battery Health button is clicked
  const handleFetchBatteryHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/realtime/batteryGraph/${nodeId}`);
        if (!response.ok) throw new Error('Failed to fetch battery health data');

        const data: { dateTime: string; batteryVoltage: any }[] = await response.json();
        console.log("Raw data received:", data);

        if (!data || data.length === 0) {
            console.error("No battery data found.");
            return;
        }

        const formattedData = data.map((entry: { dateTime: string; batteryVoltage: any }) => ({
            dateTime: entry.dateTime,
            batteryVoltage: isNaN(Number(entry.batteryVoltage)) ? 0 : Number(entry.batteryVoltage),
        }));

        console.log("Formatted data before setting state:", formattedData);

        setBatteryData({
            labels: formattedData.map((entry: { dateTime: string }) => entry.dateTime),
            voltages: formattedData.map((entry: { batteryVoltage: number }) => entry.batteryVoltage),
        });

        setShowGraph(true);
    } catch (err) {
        console.error("Error fetching battery health data:", err);
    }
};

  return (
    <Background>
      <View style={styles.container}>
        {/* Header */}
        <View>
          <WavyHeader customStyles={styles.svgCurve} />
          <Text style={styles.nodetitle}>Node {nodeId || '...'}</Text>
        </View>

        <View style={{ marginTop: 100 }}>
          {/* Loading Indicator */}
          {loading ? (
            <ActivityIndicator size="large" color="#03A9F4" style={styles.loader} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <View style={styles.contentContainer}>
              {/* Flow Meter Button */}
              <Pressable
                style={styles.Box}
                onPress={handleFetchFlowRate}
                disabled={fetchingFlowRate}
              >
                <Text style={styles.buttonText}>
                  {fetchingFlowRate
                    ? 'Fetching...'
                    : flowRate
                    ? <>
                        Click <Text style={{ fontWeight: 'bold', color: 'green' }}>again</Text> to get updated Flowmeter value
                      </>
                    : 'Click to Get Flow Meter'}
                </Text>
                {flowRate && <Text style={styles.buttonValue}>{flowRate}</Text>}
              </Pressable>

              {/* Battery Voltage Button */}
              <Pressable
                style={styles.Box}
                onPress={handleFetchBatteryVoltage}
                disabled={fetchingBatteryVoltage}
              >
                <Text style={styles.buttonText}>
                  {fetchingBatteryVoltage
                    ? 'Fetching...'
                    : batteryVoltage
                    ? <>
                        Click <Text style={{ fontWeight: 'bold', color: 'green' }}>again</Text> to get updated Battery Voltage
                      </>
                    : 'Click to Get Battery Voltage'}
                </Text>
                {batteryVoltage && <Text style={styles.buttonValue}>{batteryVoltage}</Text>}
              </Pressable>

              {/* Battery Health Button */}
              <Pressable style={styles.Box} onPress={() => handleFetchBatteryHealth()}>
                <Text style={styles.buttonText}>Battery Health</Text>
              </Pressable>
              

{/* Graph Modal */}
<Modal visible={showGraph} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <BatteryHealthGraph data={batteryData} />
                    <Pressable style={styles.closeButton} onPress={() => setShowGraph(false)}>
                      <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>



              {/* Valves Section */}
              <View style={styles.valveContainer}>
                <Text style={styles.sectionTitle}>Valves ({valves.length})</Text>
                {valves.length > 0 ? (
                  valves.map((valve, index) => (
                    <Pressable
                      key={index}
                      style={globalStyles.Button}
                      onPress={() => router.push({ pathname: '/quadra_screens/screen3', params: { id: valve.valveID } })}
                    >
                      <Text style={globalStyles.Text}>{valve.valveName}</Text>
                    </Pressable>
                  ))
                ) : (
                  <Text style={styles.noDataText}>No valves available for this node.</Text>
                )}
              </View>

              {/* Back Button */}
              <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={40} color="#337a2c" />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    width: '100%',
    backgroundColor: 'rgba(8, 141, 6, 0.7)', // Your green color
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 8,
    elevation: 4,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
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
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonValue: {
    color: '#000',
    fontSize: 20,
    marginTop: 8,
  },
  valveContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  noDataText: {
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  backButton: {
    position: 'absolute',
    bottom: -100,
    alignSelf: 'center',
    padding: 10,
  },
  nodetitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 30,
  },
  svgCurve: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    paddingHorizontal: 10,
    left: -15,
  },
  Box: {
    backgroundColor: '#F8FDE3',  // White button
    padding: 20,
    marginVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 3,  // Border thickness
    borderColor: '#4D6E13',  // Green border
    marginHorizontal: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#809c13',
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});