// // //Screen3.tsx

// import React, { useState, useEffect } from 'react';
// import { View, Text, Pressable, Switch, Modal, Alert, Platform, ActivityIndicator, StyleSheet } from 'react-native';
// import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Picker } from '@react-native-picker/picker';
// import Constants from 'expo-constants';
// import { Ionicons } from '@expo/vector-icons';

// const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

// type HistoryItem = {
//   valveID: string | number;
//   wateredDateTime: string;
//   wateredDuration: string | null;
//   waterVolume: string | null;
// };

// export default function Screen3() {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const valveID = params.id;
//   const [isTapOn, setIsTapOn] = useState(false);
//   const [wateringTime, setWateringTime] = useState(new Date());
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [showDurationPicker, setShowDurationPicker] = useState(false);
//   const [duration, setDuration] = useState(15);
//   const [liveValveStatus, setLiveValveStatus] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');
//   const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
//   const [showHistoryPopup, setShowHistoryPopup] = useState(false);

//   const navigation = useNavigation();

//   const onTimeChange = (event: any, selectedTime: Date | undefined) => {
//     if (event.type === "set" && selectedTime) {
//       setWateringTime(selectedTime);
//     }
//     setShowTimePicker(false);
//   };

//   React.useLayoutEffect(() => {
//     navigation.setOptions({ headerShown: false });
//   }, [navigation]);

//   const handleLiveValveToggle = () => {
//     setStatusMessage('Processing');
//     setTimeout(() => {
//       const commandSuccess = Math.random() < 0.8;
//       if (commandSuccess) {
//         setLiveValveStatus((prev) => !prev);
//         setStatusMessage('CMD Successful');
//       } else {
//         setStatusMessage('CMD Failed');
//       }
//     }, 2000);
//   };

//   const sendDurationToBackend = async (selectedDuration: number) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/schedule/set-duration`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           valveID,
//           duration: selectedDuration,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log('Response from backend:', data);
//       return data;
//     } catch (error) {
//       console.error('Error sending duration:', error);
//       throw error;
//     }
//   };

//   const fetchLastSavedDuration = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/schedule/get-duration/${valveID}`);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch duration: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.duration !== undefined) {
//         setDuration(data.duration);
//       }
//     } catch (error) {
//       console.error('Error fetching duration:', error);
//     }
//   };

//   const fetchHistory = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/history/get-history/${valveID}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data: HistoryItem[] = await response.json();
//       setHistoryData(data);
//     } catch (error) {
//       console.error('Error fetching history:', error);
//     }
//   };

//   useEffect(() => {
//     fetchLastSavedDuration();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Controls : Valve {valveID}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Schedule Watering Time:</Text>
//         <Pressable style={styles.button} onPress={() => setShowTimePicker(true)}>
//           <Text style={styles.buttonText}>
//             {wateringTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </Text>
//           <Text style={styles.buttonSubText}>Edit Time</Text>
//         </Pressable>
//         {showTimePicker && (
//           <DateTimePicker
//             value={wateringTime}
//             mode="time"
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={onTimeChange}
//           />
//         )}
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Set Watering Duration:</Text>
//         <Pressable style={styles.button} onPress={() => setShowDurationPicker(true)}>
//           <Text style={styles.buttonText}>{duration} min</Text>
//         </Pressable>
//         <Modal visible={showDurationPicker} transparent={true} animationType="slide">
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Select Watering Duration</Text>
//               <Picker
//                 selectedValue={duration}
//                 style={styles.picker}
//                 onValueChange={(itemValue) => setDuration(itemValue)}
//               >
//                 {[...Array(60).keys()].map((minute) => (
//                   <Picker.Item key={minute} label={`${minute + 1} min`} value={minute + 1} />
//                 ))}
//               </Picker>
//               <Pressable
//                 style={styles.confirmButton}
//                 onPress={async () => {
//                   try {
//                     await sendDurationToBackend(duration);
//                     Alert.alert("Success", "Values saved successfully to DB");
//                     setShowDurationPicker(false);
//                   } catch (error) {
//                     Alert.alert("Error", "Failed to save values to DB");
//                   }
//                 }}
//               >
//                 <Text style={styles.confirmButtonText}>Confirm</Text>
//               </Pressable>
//             </View>
//           </View>
//         </Modal>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>LIVE VALVE STATUS:</Text>
//         <Pressable
//           style={[
//             styles.button,
//             { backgroundColor: liveValveStatus === null ? '#809c13' : liveValveStatus ? '#f44336' : '#4CAF50' },
//           ]}
//           onPress={handleLiveValveToggle}
//         >
//           <Text style={styles.buttonText}>
//             {liveValveStatus === null ? 'ON / OFF' : liveValveStatus ? 'ON' : 'OFF'}
//           </Text>
//         </Pressable>
//         <Text
//           style={[
//             styles.statusMessage,
//             {
//               color: statusMessage === 'CMD Successful' ? 'green' : statusMessage === 'CMD Failed' ? 'red' : '#000',
//             },
//           ]}
//         >
//           {statusMessage}
//         </Text>
//       </View>

//       <View style={styles.tapControlContainer}>
//         <Text style={styles.tapControlTitle}>Tap Control</Text>
//         <View style={styles.tapControlToggle}>
//           <Text style={styles.tapControlText}>{isTapOn ? 'ON' : 'OFF'}</Text>
//           <Switch value={isTapOn} onValueChange={setIsTapOn} />
//         </View>
//       </View>

//       <Pressable style={styles.historyButton} onPress={() => { fetchHistory(); setShowHistoryPopup(true); }}>
//         <Text style={styles.historyButtonText}>View History</Text>
//       </Pressable>

//       <Modal visible={showHistoryPopup} transparent={true} animationType="slide">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>History</Text>
//             {historyData.length > 0 ? (
//               historyData.map((item, index) => (
//                 <View key={index} style={styles.historyItem}>
//                   <Text>Time: {item.wateredDateTime}</Text>
//                   <Text>Duration: {item.wateredDuration ?? 'N/A'}</Text>
//                   <Text>Water Volume: {item.waterVolume ?? 'N/A'}</Text>
//                 </View>
//               ))
//             ) : (
//               <Text>No history available</Text>
//             )}
//             <Pressable style={styles.closeButton} onPress={() => setShowHistoryPopup(false)}>
//               <Text style={styles.closeButtonText}>Close</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>

//       <Pressable style={styles.backButton} onPress={() => router.back()}>
//         <Ionicons name="arrow-back" size={40} color="#337a2c" />
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//   },
//   header: {
//     width: '100%',
//     backgroundColor: 'white',
//     paddingVertical: 10,
//     alignItems: 'center',
//     elevation: 4,
//   },
//   headerText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   section: {
//     marginTop: 20,
//     width: '100%',
//     alignItems: 'center',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   button: {
//     backgroundColor: '#809c13',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     width: 200,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   buttonText: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   buttonSubText: {
//     fontSize: 12,
//     color: '#fff',
//     fontWeight: '600',
//     marginTop: 4,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   picker: {
//     width: '100%',
//     height: 200,
//   },
//   confirmButton: {
//     backgroundColor: '#809c13',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     marginTop: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   confirmButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   statusMessage: {
//     marginTop: 10,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   tapControlContainer: {
//     marginTop: 10,
//     width: 200,
//     backgroundColor: '#809c13',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   tapControlTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 8,
//   },
//   tapControlToggle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//     width: '100%',
//     justifyContent: 'center',
//   },
//   tapControlText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginRight: 10,
//   },
//   historyButton: {
//     marginTop: 30,
//     backgroundColor: '#809c13',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     width: 200,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   historyButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   historyItem: {
//     backgroundColor: '#ddd',
//     padding: 10,
//     marginTop: 5,
//     borderRadius: 5,
//     width: '100%',
//     alignItems: 'center',
//   },
//   closeButton: {
//     backgroundColor: '#809c13',
//     padding: 10,
//     marginTop: 20,
//     borderRadius: 8,
//     width: 150,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   backButton: {
//     position: 'absolute',
//     bottom: 30,
//     alignSelf: 'center',
//     padding: 10,
//   },
// });





import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Switch, Modal, Alert, Platform, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

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

  const navigation = useNavigation();

  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    if (event.type === "set" && selectedTime) {
      setWateringTime(selectedTime);
    }
    setShowTimePicker(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleLiveValveToggle = () => {
    setStatusMessage('Processing');
    setTimeout(() => {
      const commandSuccess = Math.random() < 0.8;
      if (commandSuccess) {
        setLiveValveStatus((prev) => !prev);
        setStatusMessage('CMD Successful');
      } else {
        setStatusMessage('CMD Failed');
      }
    }, 2000);
  };

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

  const fetchLastSavedDuration = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule/get-duration/${valveID}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch duration: ${response.status}`);
      }

      const data = await response.json();
      if (data.duration !== undefined) {
        setDuration(data.duration);
      }
    } catch (error) {
      console.error('Error fetching duration:', error);
    }
  };

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

  useEffect(() => {
    fetchLastSavedDuration();
  }, []);

  return (
    <ImageBackground source={require('../../assets/images/Background.jpg')} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Valve Control System</Text>

        {/* //use weather api  */}
        <View style={styles.weatherInfo}>
          <Text style={styles.weatherText}>Mangalore</Text>
          <Text style={styles.weatherText}>Temperature: 29.97°C | Weather: broken clouds  </Text>
          <Text style={styles.weatherText}>Wind Speed: 6.3 m/s</Text>
        </View>



        {/* //Live valve  */}
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>LIVE VALVE STATUS:</Text>
        <Pressable
          style={[
            styles.button,
             { backgroundColor: liveValveStatus === null ? '#809c13' : liveValveStatus ? '#f44336' : '#4CAF50' },
          ]}
           onPress={handleLiveValveToggle}
         >
           <Text style={styles.buttonText}>
             {liveValveStatus === null ? 'ON / OFF' : liveValveStatus ? 'OFF' : 'ON'}
           </Text>
         </Pressable>
         <Text
           style={[
             styles.statusMessage,
             {
               color: statusMessage === 'CMD Successful' ? 'green' : statusMessage === 'CMD Failed' ? 'red' : '#000',
             },
           ]}
         >
           {statusMessage}
         </Text>
       </View>  



      </View>

      
{/* tap controll */}
      <View style={styles.tapControlContainer}>
      <Text style={styles.tapControlTitle}>Tap Control</Text>
       <Text style={styles.statusText}>Status: Tap is {isTapOn ? 'ON' : 'OFF'}</Text>
         <View style={styles.tapControlToggle}>
           <Text style={styles.tapControlText}>{isTapOn ? 'ON' : 'OFF'}</Text>
           <Switch value={isTapOn} onValueChange={setIsTapOn} />
         </View>
       </View>


{/* water scedule */}
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
                    Alert.alert("Success", "Values saved successfully to DB");
                    setShowDurationPicker(false);
                  } catch (error) {
                    Alert.alert("Error", "Failed to save values to DB");
                  }
                }}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>

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

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={40} color="#337a2c" />
      </Pressable>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    paddingTop: 40,
    alignItems: 'center', // Centers horizontally
    
  },
  header: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 10,
    alignItems: 'center',
    elevation: 4,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  weatherInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 16,
    color: '#333',
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
  tapButton: {
    backgroundColor: '#809c13',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
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
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
      },
   statusMessage: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  tapControlContainer: {
    marginTop: 50,
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
