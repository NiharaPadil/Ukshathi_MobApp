//harcoded for now

//uncomment the below code to use

// import { View, Text, Pressable, Switch, FlatList, Modal, Platform } from 'react-native';
// import { useRouter, useLocalSearchParams,useNavigation } from 'expo-router';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Picker } from '@react-native-picker/picker'; // Import Picker for duration selection
// import React, { useState } from 'react';

// export default function Screen3() {
//   const router = useRouter();
//   const { valveName, nodeId } = useLocalSearchParams(); // Retrieve parameters passed from the previous screen
//   const [isTapOn, setIsTapOn] = useState(false); // Toggle for the tap (ON/OFF)
//   const [wateringTime, setWateringTime] = useState(new Date()); // Holds the selected time
//   const [showTimePicker, setShowTimePicker] = useState(false); // Control time picker visibility
//   const [showDurationPicker, setShowDurationPicker] = useState(false); // Control duration picker visibility
//   const [duration, setDuration] = useState(15); // Holds the watering duration (default 15 minutes)
//   const navigation = useNavigation();

//   // Example history data
//   const historyData = [
//     { id: '1', time: '10:00 AM', duration: '30 min' },
//     { id: '2', time: '2:00 PM', duration: '15 min' },
//     { id: '3', time: '6:30 PM', duration: '45 min' },
//   ];

//   // Handle time selection from the time picker
  
//   const onTimeChange = (event, selectedTime) => {
//     if (event.type === "set" && selectedTime) {
//       setWateringTime(selectedTime); // Update the selected time
//     }
//     setShowTimePicker(false); // Close the picker in all cases
//   };
// // Hide the default header provided by React Navigation
//   React.useLayoutEffect(() => {
//     navigation.setOptions({ headerShown: false });
//   }, [navigation]);

//   return (
//     <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      
//           {/* HEADER SECTION */}
//                 {/* Displays a white header bar with the title "Nodes" in the center */}
//                 <View 
//                    style= // Start of the style object
//                    {{ 
//                       width: '100%', // The View takes up the full width of its parent
//                       backgroundColor: 'white', // Sets the background color to white
//                       paddingVertical: 10, // Adds 20 points of padding to the top and bottom of the View
//                       alignItems: 'center', // Centers child components along the cross axis (horizontally)
//                       elevation: 4 // Adds a shadow effect (Android-only)
//                   }}>
//                   <Text 
//                      style=
//                        {{ 
//                         fontSize: 22, // Sets the font size to 22 points
//                         fontWeight: 'bold' // Makes the text bold
//                   }}>Controls : Node {nodeId}-{valveName} </Text>
//                </View>






//    {/* Schedule Watering Time */}
// <View style={{ marginTop: 20, width: '100%',alignItems: 'center' }}>
//   <Text style={{ fontSize: 18, fontWeight: 'bold' , textAlign: 'center' , marginBottom: 8 }}>
//     Schedule Watering Time:
//   </Text>
//   <Pressable
//     style={{
//       backgroundColor: '#ffffff',
//       borderRadius: 10,//was 12
//       paddingVertical: 8, //was 15
//       paddingHorizontal: 12,//was 20
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 1 }, //height was 2
//       shadowOpacity: 0.15, // was 0.2
//       shadowRadius: 2,//was 4
//       elevation: 2,//was 4
//       borderWidth: 1,
//       borderColor: '#e0e0e0',
//       width: 180,  // addesd extra Compact width
//     }}
//     onPress={() => setShowTimePicker(true)} // Show the time picker
//   >
//     <Text style={{ fontSize: 14, color: '#333', fontWeight: '500' }}>
//       {wateringTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//     </Text>
//     <Text style={{ fontSize: 12, color: '#03A9F4', fontWeight: '600' }}>
//       Edit Time
//     </Text>
//   </Pressable>

//   {/* Time Picker */}
//   {showTimePicker && (
//     <DateTimePicker
//       value={wateringTime}
//       mode="time"
//       display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Use spinner display for iOS
//       onChange={onTimeChange} // Handle the selected time
//     />
//   )}
// </View>








//       {/* Set Watering Duration */}
//       <View style={{ marginTop: 20, width: '100%' }}>
//         <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Set Watering Duration:</Text>
//         <Pressable
//           style={{
//             backgroundColor: 'white',
//             padding: 10,
//             borderRadius: 5,
//             marginTop: 5,
//             borderWidth: 1,
//             borderColor: '#ddd',
//           }}
//           onPress={() => setShowDurationPicker(true)} // Show the duration picker modal
//         >
//           <Text>{`${duration} min`}</Text>
//         </Pressable>

//         {/* Duration Picker Modal */}
//         <Modal
//           visible={showDurationPicker}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowDurationPicker(false)} // Close the modal
//         >
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             }}
//           >
//             <View
//               style={{
//                 width: '80%',
//                 backgroundColor: 'white',
//                 borderRadius: 10,
//                 padding: 20,
//                 alignItems: 'center',
//               }}
//             >
//               <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
//                 Select Watering Duration
//               </Text>

//               <Picker
//                 selectedValue={duration}
//                 style={{ width: '100%', height: 200 }}
//                 onValueChange={(itemValue) => setDuration(itemValue)}
//               >
//                 {/* Add duration options */}
//                 {[...Array(60).keys()].map((minute) => (
//                   <Picker.Item key={minute} label={`${minute + 1} min`} value={minute + 1} />
//                 ))}
//               </Picker>

//               {/* Confirm Button */}
//               <Pressable
//                 style={{
//                   backgroundColor: '#03A9F4',
//                   padding: 10,
//                   marginTop: 20,
//                   borderRadius: 8,
//                   width: 150,
//                   alignItems: 'center',
//                 }}
//                 onPress={() => setShowDurationPicker(false)} // Close the modal
//               >
//                 <Text style={{ color: '#fff', fontSize: 16 }}>Confirm</Text>
//               </Pressable>
//             </View>
//           </View>
//         </Modal>
//       </View>






//       {/* Tap ON/OFF Toggle */}
//       <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', width: '100%' }}>
//         <Text style={{ fontSize: 18, fontWeight: 'bold', marginRight: 10 }}>Tap:</Text>
//         <Switch value={isTapOn} onValueChange={setIsTapOn} />
//         <Text style={{ marginLeft: 10 }}>{isTapOn ? 'ON' : 'OFF'}</Text>
//       </View>





//       {/* History Section */}
//       <View style={{ marginTop: 30, width: '100%' }}>
//         <Text style={{ fontSize: 18, fontWeight: 'bold' }}>History:</Text>
//         <FlatList
//           data={historyData}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={{ backgroundColor: '#ddd', padding: 10, marginTop: 5, borderRadius: 5 }}>
//               <Text>{item.time} - {item.duration}</Text>
//             </View>
//           )}
//         />
//       </View>

//       {/* Back Button */}
//       <Pressable
//         style={{
//           backgroundColor: '#03A9F4',
//           padding: 15,
//           marginTop: 30,
//           borderRadius: 8,
//           width: 200,
//           alignItems: 'center',
//         }}
//         onPress={() => router.back()} // Navigate back to the previous screen
//       >
//         <Text style={{ color: '#fff', fontSize: 18 }}>Back</Text>
//       </Pressable>
//     </View>
//   );
// }
