//ui updation needed refre from down below commneted code




import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';

export default function Screen2() {
  const [nodeId, setNodeId] = useState<string | null>(null);
  const [valves, setValves] = useState<{ valve_id: number; node_id: number; valve_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch valves data based on nodeId
  useEffect(() => {
    if (!nodeId) return; // Wait for nodeId before making API call
    const fetchValves = async () => {
      try {
        const response = await fetch(`http://192.168.1.43:5000/nodes/${nodeId}/valves`);
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

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      {/* HEADER SECTION */}
      <View style={{ width: '100%', backgroundColor: 'white', paddingVertical: 10, alignItems: 'center', elevation: 4 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Valves for Node {nodeId || '...'}</Text>
      </View>

      {!nodeId ? (
        <ActivityIndicator size="large" color="#03A9F4" style={{ marginTop: 20 }} />
      ) : loading ? (
        <ActivityIndicator size="large" color="#03A9F4" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={{ color: 'red', marginTop: 20 }}>{error}</Text>
      ) : (
        <View style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
          {/* Left Side: Valves */}
          <View style={{ flex: 1, padding: 10, marginRight: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Valves</Text>
            {valves.length > 0 ? (
              valves.map((valve, index) => (
                <Pressable
                key={index}
                style={{ backgroundColor: '#03A9F4', padding: 15, marginVertical: 8, borderRadius: 8 }}
                onPress={() => router.push(`/quadra_screens/screen3`)} // ✅ Move it here
              >
                <Text style={{ color: '#fff', fontSize: 16 }}>{valve.valve_name}</Text>
              </Pressable>
              
              ))
            ) : (
              <Text>No valves available for this node.</Text>
            )}
          </View>

          {/* Right Side: Flow Meter & Battery Voltage */}
          <View style={{ flex: 1, padding: 10, alignItems: 'center' }}>
            <View style={{ backgroundColor: '#4CAF50', padding: 20, borderRadius: 8, marginBottom: 20 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Flow Meter</Text>
              <Text style={{ color: '#fff', fontSize: 14 }}>Value: 123 L/min</Text>
            </View>
            <View style={{ backgroundColor: '#FF5722', padding: 20, borderRadius: 8 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Battery Voltage</Text>
              <Text style={{ color: '#fff', fontSize: 14 }}>Value: 12.6V</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}





// //harcode for now
//needed to refer ui....

// import { View, Text, Pressable } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';
// import { useRouter,useNavigation } from 'expo-router';
// import React from 'react';

// const nodes = [
//   { id: 1, name: 'Node 1', valves: ['Valve 1', 'Valve 2', 'Valve 3', 'Valve 4'] },
//   { id: 2, name: 'Node 2', valves: ['Valve 1', 'Valve 2', 'Valve 3', 'Valve 4'] },
//   { id: 3, name: 'Node 3', valves: ['Valve 1', 'Valve 2', 'Valve 3', 'Valve 4'] },
//   { id: 4, name: 'Node 4', valves: ['Valve 1', 'Valve 2'] },
// ];

// export default function Screen2() {
//   const { id } = useLocalSearchParams();
//   const selectedNode = nodes.find((node) => node.id === Number(id));
//   console.log("Parsed ID:", Number(id));
//   const router = useRouter();
//   const navigation = useNavigation(); // Hook to access screen navigation properties

//   // Hide the default header provided by React Navigation
//   React.useLayoutEffect(() => {
//     navigation.setOptions({ headerShown: false });
//   }, [navigation]);


//   return (
//     // <View style={{ flex: 1, padding: 20 }}>
//     <View // Start of a View component
//         style={{ // Beginning of style object
//             flex: 1, // Makes the View take up the full space of its parent
//              alignItems: 'center', // Centers child components along the cross axis (horizontally)
//              backgroundColor: '#f0f0f0' // Sets the background color to a light grey
//               }}
//               > 
    

//     {/* HEADER SECTION */}
//           {/* Displays a white header bar with the title "Nodes" in the center */}
//           <View 
//              style= // Start of the style object
//              {{ 
//                 width: '100%', // The View takes up the full width of its parent
//                 backgroundColor: 'white', // Sets the background color to white
//                 paddingVertical: 10, // Adds 20 points of padding to the top and bottom of the View
//                 alignItems: 'center', // Centers child components along the cross axis (horizontally)
//                 elevation: 4 // Adds a shadow effect (Android-only)
//             }}>
//             <Text 
//                style=
//                  {{ 
//                   fontSize: 22, // Sets the font size to 22 points
//                   fontWeight: 'bold' // Makes the text bold
//             }}>Node Details </Text>
//          </View>






    
//       {/* Top: Display all nodes - INCREASED BUTTON SIZE */}
//       <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 70, marginTop: 20 }}>
//         {nodes.map((node) => (
//           <Pressable
//             key={node.id}
//             style={{
//               backgroundColor: node.id === Number(id) ? '#c8a2c8' : '#03A9F4',
//               padding: 15, // ⬆ Increased padding for bigger button
//               margin: 8,  // ⬆ Increased margin for spacing
//               borderRadius: 8,
//               minWidth: 70, // ⬆ Ensuring buttons are wider
//               alignItems: 'center'
//             }}
//             onPress={() => router.push(`/quadra_screens/screen2?id=${node.id}`)}
//           >
//             <Text style={{ color: '#fff', fontSize: 16 }}>{node.name}</Text>
//           </Pressable>
//         ))}
//       </View>

      



     
     
//        {/* Bottom: Valves + Sensor Boxes*/}
//       <View style={{ flexDirection: 'row', flex: 1 }}>
        
//         {/* Left Side: Valves - MADE BOX BIGGER */}
//         <View style={{ flex: 1, padding: 10,marginRight: 20 }}>
//           <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Valves</Text>
//           {selectedNode?.valves.map((valve, index) => (
//             <Pressable
//               key={index}
//               style={{
//                 backgroundColor: '#03A9F4',
//                 padding: 15, // ⬆ Increased padding for bigger box
//                 marginVertical: 8, // ⬆ More spacing between boxes
//                 borderRadius: 8,
//               }}
//               onPress={() => router.push(`/quadra_screens/screen3?valveName=${valve}&nodeId=${selectedNode.id}`)}
//             >
//               <Text style={{ color: '#fff', fontSize: 16 }}>{valve}</Text>
//             </Pressable>
//           ))}
//         </View>






//         {/* Right Side: Flow Meter & Battery Voltage */}
//         <View style={{ flex: 1, padding: 10, alignItems: 'center' }}> 
//           {/* Changed justifyContent to alignItems for correct positioning */}
          
//           {/* Flow Meter - MOVED DOWN */}
//           <View style={{ backgroundColor: '#4CAF50', padding: 20, borderRadius: 8, marginTop: 50 }}>
//             {/* ⬆ Added marginBottom to create space for Battery Voltage below */}
//             <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Flow Meter</Text>
//             <Text style={{ color: '#fff', fontSize: 14 }}>Value: 123 L/min</Text>
//           </View>

//           {/* Battery Voltage - MOVED BELOW FLOW METER */}
//           <View style={{ backgroundColor: '#FF5722', padding: 20, borderRadius: 8, marginTop: 20  }}>
//             <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Battery Voltage</Text>
//             <Text style={{ color: '#fff', fontSize: 14 }}>Value: 12.6V</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }



// import { View, Text, Pressable, ActivityIndicator } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useState, useEffect } from 'react';

// // Hide header in Expo Router
// export const unstable_settings = {
//   headerShown: false,
// };

// export default function Screen2() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();

//   const [nodes, setNodes] = useState<{ id: number; name: string; valves: string[] }[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch nodes dynamically
//     const fetchNodes = async () => {
//       try {
//         const response = await fetch('http://192.168.131.23/nodes'); // Replace with your API endpoint
//         const data = await response.json();
//         setNodes(data);
//       } catch (error) {
//         console.error('Error fetching nodes:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNodes();
//   }, []);

//   const selectedNode = nodes.find((node) => node.id === Number(id));

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#03A9F4" />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f0f0f0' }}>
//       {/* Header */}
//       <View style={{ width: '100%', backgroundColor: 'white', paddingVertical: 10, alignItems: 'center', elevation: 4 }}>
//         <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Node Details</Text>
//       </View>

//       {/* Node Selection Buttons */}
//       <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20, marginTop: 20 }}>
//         {nodes.map((node) => (
//           <Pressable
//             key={node.id}
//             style={{
//               backgroundColor: node.id === Number(id) ? '#c8a2c8' : '#03A9F4',
//               padding: 15,
//               margin: 8,
//               borderRadius: 8,
//               minWidth: 70,
//               alignItems: 'center',
//             }}
//             onPress={() => router.push(`/quadra_screens/screen2?id=${node.id}`)}
//           >
//             <Text style={{ color: '#fff', fontSize: 16 }}>{node.name}</Text>
//           </Pressable>
//         ))}
//       </View>

//       {/* Valves + Sensor Data */}
//       <View style={{ flexDirection: 'row', flex: 1 }}>
//         {/* Valves Section */}
//         <View style={{ flex: 1, padding: 10, marginRight: 20 }}>
//           <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Valves</Text>
//           {selectedNode?.valves.map((valve, index) => (
//             <Pressable
//               key={index}
//               style={{
//                 backgroundColor: '#03A9F4',
//                 padding: 15,
//                 marginVertical: 8,
//                 borderRadius: 8,
//               }}
//               onPress={() => router.push(`/quadra_screens/screen3?valveName=${valve}&nodeId=${selectedNode.id}`)}
//             >
//               <Text style={{ color: '#fff', fontSize: 16 }}>{valve}</Text>
//             </Pressable>
//           ))}
//         </View>

//         {/* Flow Meter & Battery Voltage */}
//         <View style={{ flex: 1, padding: 10, alignItems: 'center' }}>
//           <View style={{ backgroundColor: '#4CAF50', padding: 20, borderRadius: 8, marginTop: 50 }}>
//             <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Flow Meter</Text>
//             <Text style={{ color: '#fff', fontSize: 14 }}>Value: 123 L/min</Text>
//           </View>
//           <View style={{ backgroundColor: '#FF5722', padding: 20, borderRadius: 8, marginTop: 20 }}>
//             <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Battery Voltage</Text>
//             <Text style={{ color: '#fff', fontSize: 14 }}>Value: 12.6V</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

//lima idk what:

