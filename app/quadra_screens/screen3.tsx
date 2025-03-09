//Screen3.tsx
//refer screen3.txt before strting

// changes made [as of 25th FEB] = Schedule watering duration is working [just frontend] use the below line to install the module
//npx expo install @react-native-community/datetimepicker

import { View, Text, Pressable, Switch, FlatList, Modal,Alert, Platform , ActivityIndicator} from 'react-native';
import { useRouter, useLocalSearchParams,useNavigation } from 'expo-router';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker'; // Import Picker for duration selection
import React, { useEffect,useState } from 'react';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

//TO DISPLAY ALL ITEMS FROM HISTORY:
type HistoryItem = {
  valveID: string | number;
  wateredDateTime: string;
  wateredDuration: string | null;
  waterVolume: string | null;
};


export default function Screen3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const valveID = params.id;;
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


  // Handle time selection from the time picker
  
  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    if (event.type === "set" && selectedTime) {
      setWateringTime(selectedTime); // Update the selected time
    }
    setShowTimePicker(false); // Close the picker in all cases
  };


// Hide the default header provided by React Navigation
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);


//LIVE VALVE STATUS ADITHIIIIIIIIIIII 
const handleLiveValveToggle = () => {
  setStatusMessage('Processing'); //first this shows processing state
  
  setTimeout(() => {
    const commandSuccess = Math.random() < 0.8; // 80% success rate

    if (commandSuccess) {
      setLiveValveStatus((prev) => !prev); // toggle state if this is success
      setStatusMessage('CMD Successful');
    } else {
      setStatusMessage('CMD Failed');
    }
  }, 2000); 
};
//LIVE VALVE STATUS ADITHIIIIIIIIIIII 



//FUNCTIONS FROM HERE WORKING FOR NEW API-DB

//1) WATERING DURATION 1ST PART: function to send duration to be saved in db
const sendDurationToBackend = async (selectedDuration: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule/set-duration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        valveID, 
        duration: selectedDuration 
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`); // Throw error for non-200 responses
    }

    const data = await response.json();
    console.log('Response from backend:', data);
    return data; // Return response data if needed
  } catch (error) {
    console.error('Error sending duration:', error);
    throw error; // Re-throw error to handle it in the UI
  }
};


//2) WAYERING DURATION 2ND PART: function to get duration from db so tht it will be in latest duration fecthed
const fetchLastSavedDuration = async () => {
  try {
    console.log("Fetching duration for valveID:", valveID); // Debugging log

    if (!valveID) {
      console.error("valveID is undefined or empty!");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/schedule/get-duration/${valveID}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch duration: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched data:", data);

    if (data.duration !== undefined) {
      setDuration(data.duration); // Update UI with the saved duration
    }
  } catch (error) {
    console.error('Error fetching duration:', error);
  }
};

// Call this function when the component mounts
useEffect(() => {
  fetchLastSavedDuration();
}, []);

//3) HISTORY FUNCTION: to diaply history from db for particular node
const fetchHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/history/get-history/${valveID}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: HistoryItem[] = await response.json(); // Use the defined type
    setHistoryData(data); // Update state
  } catch (error) {
    console.error('Error fetching history:', error);
  }
};





  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      
          {/* HEADER SECTION */}
                {/* Displays a white header bar with the title "Nodes" in the center */}
                <View 
                   style= // Start of the style object
                   {{ 
                      width: '100%', // The View takes up the full width of its parent
                      backgroundColor: 'white', // Sets the background color to white
                      paddingVertical: 10, // Adds 20 points of padding to the top and bottom of the View
                      alignItems: 'center', // Centers child components along the cross axis (horizontally)
                      elevation: 4 // Adds a shadow effect (Android-only)
                  }}>
                  <Text 
                     style=
                       {{ 
                        fontSize: 22, // Sets the font size to 22 points
                        fontWeight: 'bold' // Makes the text bold
                  }}>Controls : Valve {valveID} </Text>
               </View>




   {/* Schedule Watering Time */}
<View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
  <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
    Schedule Watering Time:
  </Text>

  {/* Button to Open Time Picker */}
  <Pressable
    style={{
      backgroundColor: '#809c13',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      width: 200,  // Change from 180 to 200
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    }}
    onPress={() => setShowTimePicker(true)} // Open Time Picker
  >
    <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>
      {wateringTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </Text>
    <Text style={{ fontSize: 12, color: '#fff', fontWeight: '600', marginTop: 4 }}>
      Edit Time
    </Text>
  </Pressable>

  {/* Time Picker (Still Commented) */}
{showTimePicker && (
  <DateTimePicker
    value={wateringTime}
    mode="time"
    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
    onChange={onTimeChange}
  />
)}

</View>







{/*WORKING THIS*/}
 {/* Set Watering Duration */}    
   {/*FOR THIS PART WHOLE API THING I SDONE WORKING FINE*/}

<View style={{ marginTop: 20, alignItems: 'center' }}>
  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Set Watering Duration:</Text>
  
  <Pressable
    style={{
      backgroundColor: '#809c13',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      width: 200,  // Change from default to 200
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    }}
    onPress={() => setShowDurationPicker(true)} // Show the duration picker modal
  
  >
    <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>
      {duration} min
    </Text>
  </Pressable>

  {/* Duration Picker Modal */}
  <Modal
    visible={showDurationPicker}
    transparent={true}
    animationType="slide"
    onRequestClose={() => setShowDurationPicker(false)} // Close the modal
  >
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <View
        style={{
          width: '80%',
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Select Watering Duration
        </Text>

        <Picker
          selectedValue={duration}
          style={{ width: '100%', height: 200 }}
          onValueChange={(itemValue) => setDuration(itemValue)}
        >
          {[...Array(60).keys()].map((minute) => (
            <Picker.Item key={minute} label={`${minute + 1} min`} value={minute + 1} />
          ))}
        </Picker>

        {/* Confirm Button */}
        <Pressable
          style={{
            backgroundColor: '#809c13',
            paddingVertical: 12,
            paddingHorizontal: 20,
            marginTop: 20,
            borderRadius: 8,
            alignItems: 'center',
          }}
          onPress={async () => {
            try {
              await sendDurationToBackend(duration); // Save to DB
              Alert.alert("Success", "Values saved successfully to DB"); // Show success message
              setShowDurationPicker(false); // Close modal
            } catch (error) {
              Alert.alert("Error", "Failed to save values to DB"); // Handle errors
            }
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Confirm</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
</View>

{/*TILL HERE WATERING DURATION*/}



{/* LIVE VALVE STATUS ADITHIIIIIIIIIIII  */}
{/* Live Valve Status Section */}
<View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>LIVE VALVE STATUS:</Text>

  <Pressable
    style={{
      backgroundColor: liveValveStatus === null ? '#809c13' : liveValveStatus ? '#f44336' : '#4CAF50', 
      // Blue for default, red when ON, green when OFF
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      width: 200,
      alignItems: 'center',
      justifyContent: 'center',
    }}
    onPress={handleLiveValveToggle}
  >
    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
      {liveValveStatus === null ? 'ON / OFF' : liveValveStatus ? 'ON' : 'OFF'}
    </Text>
  </Pressable>

  <Text style={{
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: statusMessage === 'CMD Successful' ? 'green' :
           statusMessage === 'CMD Failed' ? 'red' : '#000'
  }}>
    {statusMessage}
  </Text>
</View>




{/* Tap ON/OFF Toggle - Single Box */}
<View
  style={{
    marginTop: 10,
    width: 200, // Matching other button dimensions
    backgroundColor: '#809c13', // Blue background
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    
  }}
>
  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 8 }}>Tap Control</Text>

  {/* Light Background for Toggle */}
  <View 
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff', // White background to contrast the switch
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      width: '100%', // Ensuring it stretches inside
      justifyContent: 'center'
    }}
  >
    <Text style={{ fontSize: 14, fontWeight: 'bold', marginRight: 10 }}> {isTapOn ? 'ON' : 'OFF'}</Text>
    <Switch value={isTapOn} onValueChange={setIsTapOn} />
  </View>
</View>



{/*WORKING */}
{/* History Button */}
{/*APIS WORKING HERE FOR HISTORY */}

<Pressable
        style={{
          marginTop: 30,
          backgroundColor: '#809c13',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          width: 200,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          fetchHistory(); // Fetch history before showing modal
          setShowHistoryPopup(true);
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>View History</Text>
      </Pressable>

      {/* History Details Modal */}
      <Modal
        visible={showHistoryPopup}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHistoryPopup(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' }}>
            
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>History</Text>

            {historyData.length > 0 ? (
              historyData.map((item, index) => (
                <View key={index} style={{ backgroundColor: '#ddd', padding: 10, marginTop: 5, borderRadius: 5, width: '100%', alignItems: 'center' }}>
                  <Text>Time: {item.wateredDateTime}</Text>
                  <Text>Duration: {item.wateredDuration ?? 'N/A'}</Text>
                  <Text>Waterr Volume: {item.waterVolume ?? 'N/A'}</Text>
                </View>
              ))
            ) : (
              <Text>No history available</Text>
            )}

            {/* Close Button */}
            <Pressable
              style={{
                backgroundColor: '#809c13',
                padding: 10,
                marginTop: 20,
                borderRadius: 8,
                width: 150,
                alignItems: 'center',
              }}
              onPress={() => setShowHistoryPopup(false)}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>Close</Text>
            </Pressable>

          </View>
        </View>
      </Modal>

      {/* Back Button */}
   <Pressable
  style={{
    position: 'absolute',  // Keep it fixed at the bottom
    bottom: 30,            // Distance from the bottom
    alignSelf: 'center',   // Center it horizontally
    padding: 10,
  }}
  onPress={() => router.back()} // Navigate back
>
  <Ionicons name="arrow-back" size={40} color="#337a2c" />
</Pressable>

    </View>
  );
}