import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Switch, Modal, Alert, Platform, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import WeatherComponent from '../../components_ad/WeatherInfo';
import BackgroundImage from '../../components_ad/Background';
import BackButton from '../../components_ad/BackButton';

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
  const [scheduleStatus, setScheduleStatus] = useState({
    status: 'Updated', // 'Updated' or 'Error'
    lastUpdated: new Date().toLocaleString(), // Timestamp
  });
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);
 


  // Disable buttons when watering is about to start or has started 
  interface DisableRange {
    startTime: Date;
    endTime: Date;
  }

  const calculateDisableRange = (wateringTime: Date, duration: number): DisableRange => {
    const startTime = new Date(wateringTime.getTime() - 5 * 60000); // 5 minutes before
    const endTime = new Date(wateringTime.getTime() + (duration + 5) * 60000); // duration + 5 minutes after
    return { startTime, endTime };
  };

  useEffect(() => {
    const { startTime, endTime } = calculateDisableRange(wateringTime, duration);
  
    const checkTimeRange = () => {
      const now = new Date();
      if (now >= startTime && now <= endTime) {
        setAreButtonsDisabled(true); // Disable buttons
      } else {
        setAreButtonsDisabled(false); // Enable buttons
      }
    };
  
    // Check immediately on mount
    checkTimeRange();
  
    // Check every minute
    const interval = setInterval(checkTimeRange, 60000);
  
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [wateringTime, duration]);



//schedule
  useEffect(() => {
    const fetchScheduleStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/schedule/schedule-status/${valveID}`);
        const data = await response.json();
        // console.log('Schedule Status Response:', data); // Debug log
  
        // Update schedule status based on scheduleChange
        setScheduleStatus(prev => {
          if (prev.status === 'Updated' && data.scheduleChange === 1) {
            return { status: 'Error, Restart device', lastUpdated: new Date().toLocaleString() };
          } else if (prev.status === 'Error, Restart device' && data.scheduleChange === 0) {
            return { status: 'Updated', lastUpdated: new Date().toLocaleString() };
          }
          return prev; // No change
        });
      } catch (error) {
        console.error('Error fetching schedule status:', error);
      }
    };
  
    // Poll every 5 seconds
    const interval = setInterval(fetchScheduleStatus, 5000);
    return () => clearInterval(interval);
  }, [valveID]);
  

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
        console.log('Last scheduled time:', wateringTime);
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
        console.log('Last saved duration:', duration);
      }
    } catch (error) {
      console.error('Error fetching duration:', error);
    }
  };


  // Toggle live valve status
  const handleLiveValveToggle = async () => {
    // Optimistically update UI
    setLiveValveStatus(prev => !prev);
    setStatusMessage('Processing');
  
    // Send toggle request to backend
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
  const fetchLiveValveStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/live/valves/${valveID}`);
      const data = await response.json();

      // Update live valve status based on DIK and ManualOP
      switch (Number(data.DIK)) {
        case 1:
          setStatusMessage('Processing');
          break;
        case 2:
          setStatusMessage('CMD Successful');
          setLiveValveStatus(data.ManualOP === 0); // Update live valve status
          break;
        case 3:
          setStatusMessage('CMD Failed');
          setLiveValveStatus(prev => !prev); // Revert live valve status
          break;
        default:
          console.warn('Unexpected DIK value:', data.DIK);
      }
    } catch (error) {
      console.error('Error fetching live valve status:', error);
    }
  };

  // Poll every 2 seconds
  const interval = setInterval(fetchLiveValveStatus, 2000);
  return () => clearInterval(interval);
}, [valveID]);


useEffect(() => {
  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/live/valves/${valveID}`);
      if (!response.ok) throw new Error('HTTP error');
      
      const data = await response.json();
      // console.log('Polling response:', data); // Debugging line
      
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
  // const onTimeChange = async (event: any, selectedTime: Date | undefined) => {
  //   if (selectedTime) {
  //     setWateringTime(selectedTime);
  //     setShowTimePicker(false);


  //        // Schedule notification
  //   await fetch(`${API_BASE_URL}/notifications/schedule-notification`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       valveID,
  //       wateringTime: selectedTime.toISOString()
  //       //UserId,
  //     })
  //   });

  //     const formattedTime = selectedTime.toLocaleTimeString('en-GB', { hour12: false });
  //     const startDate = new Date().toISOString().split('T')[0];

  //     try {
  //       const response = await fetch(`${API_BASE_URL}/schedule/set-schedule`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           valveID,
  //           startDate,
  //           duration,
  //           time: formattedTime,
  //           scheduleChange: 1,
  //           onoff: 1,
  //           weather: 0,
  //         }),
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Server error: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       console.log('Schedule saved:', data);
  //       Alert.alert('Success', 'Schedule saved successfully');
  //     } catch (error) {
  //       console.error('Error saving schedule:', error);
  //       Alert.alert('Error', 'Failed to save schedule');
  //     }
  //   }
  // };



  const onTimeChange = async (event: any, selectedTime: Date | undefined) => {
    if (selectedTime) {
      try {
        setWateringTime(selectedTime);
        setShowTimePicker(false);
  
        // Get stored userID from AsyncStorage
        const storedUserID = await AsyncStorage.getItem('userID');
        
        if (!storedUserID) {
          Alert.alert('Error', 'User not logged in');
          return;
        }
  
        // 1. Schedule Notification Request
        await fetch(`${API_BASE_URL}/notifications/schedule-notification`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            valveID,
            wateringTime: selectedTime.toISOString(),
            userID: storedUserID // Send userID directly
          })
        });
  
        // 2. Schedule Set Request
        const formattedTime = selectedTime.toLocaleTimeString('en-GB', { hour12: false });
        const startDate = new Date().toISOString().split('T')[0];
  
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
            userID: storedUserID // Send userID here too
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Schedule saved:', data);
        Alert.alert('Success', 'Schedule saved successfully');
  
      } catch (error) {
        console.error('Error:', error);
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
      <ScrollView>
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
    style={[styles.button, { backgroundColor: liveValveStatus ? '#f44336' : '#4CAF50' }, areButtonsDisabled && styles.disabledButton]}
    onPress={handleLiveValveToggle}
    disabled={areButtonsDisabled}
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
<View style={[
  styles.tapControlContainer,
  areButtonsDisabled && styles.disabledContainer
]}>
  <Text style={[
    styles.tapControlTitle,
    areButtonsDisabled && styles.disabledText
  ]}>
    Tap Control
  </Text>
  <Text style={[
    styles.statusText,
    areButtonsDisabled && styles.disabledText
  ]}>
    Status: Tap is {isTapOn ? 'ON' : 'OFF'}
  </Text>
  <View style={styles.tapControlToggle}>
    <Text style={[
      styles.tapControlText,
      areButtonsDisabled && styles.disabledText
    ]}>
      {isTapOn ? 'ON' : 'OFF'}
    </Text>
    <Switch 
      value={isTapOn} 
      onValueChange={areButtonsDisabled ? undefined : handleToggle}
      disabled={areButtonsDisabled}
      trackColor={{
        false: areButtonsDisabled ? '#cccccc' : '#767577',
        true: areButtonsDisabled ? '#a5d6a7' : '#81c784'
      }}
      thumbColor={isTapOn ? '#f5dd4b' : '#f4f3f4'}
    />
  </View>
</View>




        {/* Pump Control */}
        <View style={styles.tapControlContainer}>
          <Text style={styles.tapControlTitle}>Pump Control</Text>
          <Text style={styles.statusText}>Status: Pump is {isTapOn ? 'ON' : 'OFF'}</Text>
          <View style={styles.tapControlToggle}>
            <Text style={styles.tapControlText}>{isTapOn ? 'ON' : 'OFF'}</Text>
            {/* Pump logic later */}
            <Switch />
          </View>
        </View>

       {/* Water Time */}
<View style={[styles.controlSection, { marginTop: -50 }]}>
  <Text style={styles.sectionTitle}>Schedule Watering Time:</Text>
  <Pressable 
    style={[styles.button, areButtonsDisabled && styles.disabledButton]} 
    onPress={areButtonsDisabled ? undefined : () => setShowTimePicker(true)}
    disabled={areButtonsDisabled}
  >
    <Text style={[styles.buttonText, areButtonsDisabled && styles.disabledText]}>
      {wateringTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </Text>
    <Text style={[styles.buttonSubText, areButtonsDisabled && styles.disabledText]}>
      Edit Time
    </Text>
  </Pressable>
  {showTimePicker && !areButtonsDisabled && (
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
  <Text style={[styles.sectionTitle, areButtonsDisabled && styles.disabledText]}>
    Set Watering Duration:
  </Text>
  <Pressable 
    style={[styles.button, areButtonsDisabled && styles.disabledButton]} 
    onPress={areButtonsDisabled ? undefined : () => setShowDurationPicker(true)}
    disabled={areButtonsDisabled}
  >
    <Text style={[styles.buttonText, areButtonsDisabled && styles.disabledText]}>
      {duration} min
    </Text>
  </Pressable>
  <Modal 
    visible={showDurationPicker && !areButtonsDisabled} 
    transparent={true} 
    animationType="slide"
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Watering Duration</Text>
        <Picker
          selectedValue={duration}
          style={styles.picker}
          onValueChange={areButtonsDisabled ? undefined : (itemValue) => setDuration(itemValue)}
          enabled={!areButtonsDisabled}
        >
          {[...Array(60).keys()].map((minute) => (
            <Picker.Item key={minute} label={`${minute + 1} min`} value={minute + 1} />
          ))}
        </Picker>
        <Pressable
          style={[styles.confirmButton, areButtonsDisabled && styles.disabledButton]}
          onPress={areButtonsDisabled ? undefined : async () => {
            try {
              await sendDurationToBackend(duration);
              Alert.alert('Success', 'Values saved successfully to DB');
              setShowDurationPicker(false);
            } catch (error) {
              Alert.alert('Error', 'Failed to save values to DB');
            }
          }}
          disabled={areButtonsDisabled}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
</View>


        {/* Status Indicator */}
<View style={styles.statusContainer}>
  <Text style={styles.statusLabel}>Schedule Status:</Text>
  <View style={[
    styles.statusIndicator,
    scheduleStatus.status === 'Updated' ? styles.updated : styles.error
  ]}>
    <Text style={styles.statusText}>
      {scheduleStatus.status}
    </Text>
  </View>
  <Text style={styles.statusTime}>
    Last updated: {scheduleStatus.lastUpdated}
  </Text>
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
        <BackButton onPress={() => router.back()} />
      </View>
      </ScrollView>
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
      marginTop: 25,
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
      bottom: 60,
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
      marginBottom: 80,
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
    statusContainer: {
      marginTop: 20,
      padding: 15,
      backgroundColor: '#fff',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      
    },
    statusLabel: {
      fontSize: 16,
      color: '#666',
      marginBottom: 8,
    },
    statusIndicator: {
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    statusTime: {
      fontSize: 12,
      color: '#999',
      marginTop: 8,
    },
    updated: {
      backgroundColor: '#4CAF50',
    },
    error: {
      backgroundColor: '#f44336',
    },
    disabledButton: {
      backgroundColor: '#ccc', // Grayed out
    },
    disabledContainer: {
      opacity: 0.6,
    },
    disabledText: {
      color: '#888',
    }
  });




//Tried Componenting this ..some errors , will try again later

// import React, { useState, useEffect } from 'react';
// import { ScrollView, View, StyleSheet } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import BackgroundImage from '../../components_ad/Background';
// import BackButton from '../../components_ad/BackButton';
// import Header from '../../components_ad/valve-control/Header';
// import LiveValveStatus from '../../components_ad/valve-control/LiveValveStatus';
// import TapControl from '../../components_ad/valve-control/TapControl';
// import TimePicker from '../../components_ad/valve-control/TimePicker';
// import DurationPicker from '../../components_ad/valve-control/DurationPicker';
// import StatusIndicator from '../../components_ad/valve-control/StatusIndicator';
// import HistoryButton from '../../components_ad/valve-control/HistoryButton';
// import HistoryModal from '../../components_ad/valve-control/HistoryModal';

// export default function Screen3() {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const valveID = Array.isArray(params.id) ? params.id[0] : params.id;

//   const [isTapOn, setIsTapOn] = useState(false);
//   const [wateringTime, setWateringTime] = useState(new Date());
//   const [duration, setDuration] = useState(15);
//   const [liveValveStatus, setLiveValveStatus] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');
//   const [historyData, setHistoryData] = useState([]);
//   const [showHistoryPopup, setShowHistoryPopup] = useState(false);
//   const [scheduleStatus, setScheduleStatus] = useState({
//     status: 'Updated',
//     lastUpdated: new Date().toLocaleString(),
//   });

//   // Add your API calls and logic here...

//   return (
//     <BackgroundImage>
//       <ScrollView>
//         <View style={styles.container}>
//           <Header valveID={valveID} />
//           <LiveValveStatus
//             status={{ message: liveValveStatus ? 'OFF' : 'ON', color: liveValveStatus ? '#f44336' : '#4CAF50' }}
//             onPress={() => setLiveValveStatus(!liveValveStatus)}
//           />
//           <TapControl isTapOn={isTapOn} onToggle={(value) => setIsTapOn(value)} />
//           <TimePicker wateringTime={wateringTime} onTimeChange={(event, selectedTime) => {
//             if (selectedTime) setWateringTime(selectedTime);
//           }} />
//           <DurationPicker duration={duration} onDurationChange={setDuration} />
//           <StatusIndicator scheduleStatus={scheduleStatus} />
//           <HistoryButton onPress={() => {
//             // Fetch history and show modal
//             setShowHistoryPopup(true);
//           }} />
//           <HistoryModal
//             visible={showHistoryPopup}
//             data={historyData}
//             onClose={() => setShowHistoryPopup(false)}
//           />
//           <BackButton onPress={() => router.back()} />
//         </View>
//       </ScrollView>
//     </BackgroundImage>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     paddingTop: 15,
//     alignItems: 'center',
//   },

// }); 