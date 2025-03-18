import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Switch, Modal, Alert, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import WeatherComponent from '../../components_ad/WeatherInfo';
import BackgroundImage from '../../components_ad/Background';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

type HistoryItem = {
  valveID: string | number;
  wateredDateTime: string;
  wateredDuration: string | null;
  waterVolume: string | null;
};

export default function Screen3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const valveID = params.id;
  const [isTapOn, setIsTapOn] = useState(false);
  const [wateringTime, setWateringTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [duration, setDuration] = useState(15);
  const [liveValveStatus, setLiveValveStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dikStatus, setDikStatus] = useState<1 | 2 | 3 | null>(null);
  

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // await fetchValveStatus();
        await fetchLastScheduledTime();
        await fetchLastSavedDuration();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);


  // Fetch last scheduled time
  const fetchLastScheduledTime = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule/get-schedule/${valveID}`);
      if (!response.ok) throw new Error(`Failed to fetch schedule: ${response.status}`);
      
      const data = await response.json();
      if (data.time) {
        const [hours, minutes] = data.time.split(':');
        const lastTime = new Date();
        lastTime.setHours(parseInt(hours, 10));
        lastTime.setMinutes(parseInt(minutes, 10));
        setWateringTime(lastTime);
      }
    } catch (error) {
      console.error('Error fetching scheduled time:', error);
    }
  };

  // Fetch last saved duration
  const fetchLastSavedDuration = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule/get-duration/${valveID}`);
      if (!response.ok) throw new Error(`Failed to fetch duration: ${response.status}`);
      
      const data = await response.json();
      if (data.duration !== undefined) {
        setDuration(data.duration);
      }
    } catch (error) {
      console.error('Error fetching duration:', error);
    }
  };


  // Toggle live valve status
const handleLiveValveToggle = async () => {
  // 1. Optimistically update UI
  setLiveValveStatus(prev => !prev);
  setStatusMessage('Processing');

  // 2. Send toggle request to backend
  try {
    await fetch(`${API_BASE_URL}/live/valves/${valveID}/toggle`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Toggle failed:', error);
    // Revert UI if needed
    setLiveValveStatus(prev => !prev);
  }
};
// Poll DIK status every 2 seconds
// In your polling useEffect
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/live/valves/${valveID}`);
      const data = await response.json();
      
      // Handle case sensitivity for DIK value
      const dik = data.DIK; // Important: Use uppercase DIK to match backend response

      // Update status message
      switch (Number(data.DIK)) {
        case 1: 
          setStatusMessage('Processing');
          break;
        case 2: 
          setStatusMessage('CMD Successful');
          break;
        case 3: 
          setStatusMessage('CMD Failed');
          break;
        default:
          // Maintain current status if unexpected value
          break;
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, 2000);

  return () => clearInterval(interval);
}, []);



useEffect(() => {
  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/live/valves/${valveID}`);
      if (!response.ok) throw new Error('HTTP error');
      
      const data = await response.json();
      console.log('Polling response:', data); // Debugging line
      
      // Make sure we're using the correct case for DIK (backend uses uppercase)
      switch (data.DIK) { // <-- Note uppercase DIK here
        case 1: 
          setStatusMessage('Processing');
          break;
        case 2: 
          setStatusMessage('CMD Successful');
          // Update the switch state if needed
          setLiveValveStatus(data.ManualOP === 0);
          break;
        case 3: 
          setStatusMessage('CMD Failed');
          // Revert to previous state if command failed
          setLiveValveStatus(prev => !prev);
          break;
        default:
          console.warn('Unexpected DIK value:', data.DIK);
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  };

  const interval = setInterval(fetchStatus, 5000);
  return () => clearInterval(interval);
}, [valveID]); // Add valveID to dependencies

  // Fetch history
  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history/get-history/${valveID}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: HistoryItem[] = await response.json();
      setHistoryData(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  // Update onoff status
  const updateOnoffStatus = async (newOnoff: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tap/update-onoff/${valveID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ onoff: newOnoff }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update onoff status: ${response.status}`);
      }

      const data = await response.json();
      console.log('onoff status updated:', data);
      Alert.alert('Success', 'Onoff status updated successfully');
    } catch (error) {
      console.error('Error updating onoff status:', error);
    }
  };

  // Handle toggle switch
  const handleToggle = (newValue: boolean) => {
    setIsTapOn(newValue);
    updateOnoffStatus(newValue ? 1 : 0); // Send 1 for ON, 0 for OFF
  };

  // Handle time change
  const onTimeChange = async (event: any, selectedTime: Date | undefined) => {
    if (selectedTime) {
      setWateringTime(selectedTime);
      setShowTimePicker(false);

      const formattedTime = selectedTime.toLocaleTimeString('en-GB', { hour12: false });
      const startDate = new Date().toISOString().split('T')[0];

      try {
        const response = await fetch(`${API_BASE_URL}/schedule/set-schedule`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            valveID,
            startDate,
            duration,
            time: formattedTime,
            scheduleChange: 1,
            onoff: 1,
            weather: 0,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Schedule saved:', data);
        Alert.alert('Success', 'Schedule saved successfully');
      } catch (error) {
        console.error('Error saving schedule:', error);
        Alert.alert('Error', 'Failed to save schedule');
      }
    }
  };

  // Send duration to backend
  const sendDurationToBackend = async (selectedDuration: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule/set-duration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valveID,
          duration: selectedDuration,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response from backend:', data);
      return data;
    } catch (error) {
      console.error('Error sending duration:', error);
      throw error;
    }
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Valve Control System for {valveID}</Text>
          <View style={styles.weatherInfo}>
            <WeatherComponent />
          </View>
        </View>

       {/* Live Valve Status */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>LIVE VALVE STATUS:</Text>
  <Pressable
    style={[styles.button, { backgroundColor: liveValveStatus ? '#f44336' : '#4CAF50' }]}
    onPress={handleLiveValveToggle}
  >
    <Text style={styles.buttonText}>
      {liveValveStatus ? 'OFF' : 'ON'}
    </Text>
  </Pressable>
  <Text style={[
    styles.statusMessage,
    { 
      color: statusMessage === 'CMD Successful' ? '#4CAF50' :  // Green
             statusMessage === 'CMD Failed' ? '#f44336' :     // Red
             '#000' // Amber for Processing
    }
  ]}>
    {statusMessage}
  </Text>
</View>

        {/* Tap Control */}
        <View style={styles.tapControlContainer}>
          <Text style={styles.tapControlTitle}>Tap Control</Text>
          <Text style={styles.statusText}>Status: Tap is {isTapOn ? 'ON' : 'OFF'}</Text>
          <View style={styles.tapControlToggle}>
            <Text style={styles.tapControlText}>{isTapOn ? 'ON' : 'OFF'}</Text>
            <Switch value={isTapOn} onValueChange={handleToggle} />
          </View>
        </View>

        {/* Water Schedule */}
        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Schedule Watering Time:</Text>
          <Pressable style={styles.button} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.buttonText}>
              {wateringTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text style={styles.buttonSubText}>Edit Time</Text>
          </Pressable>
          {showTimePicker && (
            <DateTimePicker
              value={wateringTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
            />
          )}
        </View>

        {/* Water Duration */}
        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Set Watering Duration:</Text>
          <Pressable style={styles.button} onPress={() => setShowDurationPicker(true)}>
            <Text style={styles.buttonText}>{duration} min</Text>
          </Pressable>
          <Modal visible={showDurationPicker} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Watering Duration</Text>
                <Picker
                  selectedValue={duration}
                  style={styles.picker}
                  onValueChange={(itemValue) => setDuration(itemValue)}
                >
                  {[...Array(60).keys()].map((minute) => (
                    <Picker.Item key={minute} label={`${minute + 1} min`} value={minute + 1} />
                  ))}
                </Picker>
                <Pressable
                  style={styles.confirmButton}
                  onPress={async () => {
                    try {
                      await sendDurationToBackend(duration);
                      Alert.alert('Success', 'Values saved successfully to DB');
                      setShowDurationPicker(false);
                    } catch (error) {
                      Alert.alert('Error', 'Failed to save values to DB');
                    }
                  }}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>

        {/* History */}
        <Pressable style={styles.historyButton} onPress={() => { fetchHistory(); setShowHistoryPopup(true); }}>
          <Text style={styles.historyButtonText}>View History</Text>
        </Pressable>

        <Modal visible={showHistoryPopup} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>History</Text>
              {historyData.length > 0 ? (
                historyData.map((item, index) => (
                  <View key={index} style={styles.historyItem}>
                    <Text>Time: {item.wateredDateTime}</Text>
                    <Text>Duration: {item.wateredDuration ?? 'N/A'}</Text>
                    <Text>Water Volume: {item.waterVolume ?? 'N/A'}</Text>
                  </View>
                ))
              ) : (
                <Text>No history available</Text>
              )}
              <Pressable style={styles.closeButton} onPress={() => setShowHistoryPopup(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Back Button */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={40} color="#337a2c" />
        </Pressable>
      </View>
    </BackgroundImage>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingTop: 15,
      alignItems: 'center',
    },
    header: {
      width: '100%',
      backgroundColor: 'white',
      paddingVertical: 30,
      alignItems: 'center',
      borderRadius: 18,
      shadowColor: '#000',
      elevation: 4,
      height: 260,
    },
    headerText: {
      fontSize: 22,
      fontWeight: 'bold',
    },
    weatherInfo: {
      padding: -100,
      marginTop: -100,
      alignItems: 'center',
    },
    controlSection: {
      marginTop: 20,
      width: '100%',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    statusText: {
      fontSize: 16,
      color: '#333',
      marginBottom: 8,
    },
    button: {
      backgroundColor: '#809c13',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      width: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: 'bold',
    },
    buttonSubText: {
      fontSize: 12,
      color: '#fff',
      fontWeight: '600',
      marginTop: 4,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    picker: {
      width: '100%',
      height: 200,
    },
    confirmButton: {
      backgroundColor: '#809c13',
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginTop: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    confirmButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    historyButton: {
      marginTop: 50,
      backgroundColor: '#809c13',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      width: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    historyButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    historyItem: {
      backgroundColor: '#ddd',
      padding: 10,
      marginTop: 5,
      borderRadius: 5,
      width: '100%',
      alignItems: 'center',
    },
    closeButton: {
      backgroundColor: '#809c13',
      padding: 10,
      marginTop: 20,
      borderRadius: 8,
      width: 150,
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    backButton: {
      position: 'absolute',
      bottom: 30,
      alignSelf: 'center',
      padding: 10,
    },
    section: {
      marginTop: -110,
      marginBottom: 120,
      width: '100%',
      alignItems: 'center',
    },
    statusMessage: {
      marginTop: 10,
      fontSize: 14,
      fontWeight: '600',
    },
    tapControlContainer: {
      marginTop: -60,
      width: 200,
      backgroundColor: '#809c13',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    tapControlTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 8,
    },
    tapControlToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      width: '100%',
      justifyContent: 'center',
    },
    tapControlText: {
      fontSize: 14,
      fontWeight: 'bold',
      marginRight: 10,
    },
  });

 