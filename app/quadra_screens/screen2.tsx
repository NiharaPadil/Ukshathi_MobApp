//harcode for now


import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter,useNavigation } from 'expo-router';
import React from 'react';

const nodes = [
  { id: 1, name: 'Node 1', valves: ['Valve 1', 'Valve 2', 'Valve 3', 'Valve 4'] },
  { id: 2, name: 'Node 2', valves: ['Valve 1', 'Valve 2', 'Valve 3', 'Valve 4'] },
  { id: 3, name: 'Node 3', valves: ['Valve 1', 'Valve 2', 'Valve 3', 'Valve 4'] },
  { id: 4, name: 'Node 4', valves: ['Valve 1', 'Valve 2'] },
];

export default function Screen2() {
  const { id } = useLocalSearchParams();
  const selectedNode = nodes.find((node) => node.id === Number(id));
  console.log("Parsed ID:", Number(id));
  const router = useRouter();
  const navigation = useNavigation(); // Hook to access screen navigation properties

  // Hide the default header provided by React Navigation
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);


  return (
    // <View style={{ flex: 1, padding: 20 }}>
    <View // Start of a View component
        style={{ // Beginning of style object
            flex: 1, // Makes the View take up the full space of its parent
             alignItems: 'center', // Centers child components along the cross axis (horizontally)
             backgroundColor: '#f0f0f0' // Sets the background color to a light grey
              }}
              > 
    

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
            }}>Node Details </Text>
         </View>






    
      {/* Top: Display all nodes - INCREASED BUTTON SIZE */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 70, marginTop: 20 }}>
        {nodes.map((node) => (
          <Pressable
            key={node.id}
            style={{
              backgroundColor: node.id === Number(id) ? '#c8a2c8' : '#03A9F4',
              padding: 15, // ⬆ Increased padding for bigger button
              margin: 8,  // ⬆ Increased margin for spacing
              borderRadius: 8,
              minWidth: 70, // ⬆ Ensuring buttons are wider
              alignItems: 'center'
            }}
            onPress={() => router.push(`/quadra_screens/screen2?id=${node.id}`)}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>{node.name}</Text>
          </Pressable>
        ))}
      </View>

      



     
     
       {/* Bottom: Valves + Sensor Boxes*/}
      <View style={{ flexDirection: 'row', flex: 1 }}>
        
        {/* Left Side: Valves - MADE BOX BIGGER */}
        <View style={{ flex: 1, padding: 10,marginRight: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Valves</Text>
          {selectedNode?.valves.map((valve, index) => (
            <Pressable
              key={index}
              style={{
                backgroundColor: '#03A9F4',
                padding: 15, // ⬆ Increased padding for bigger box
                marginVertical: 8, // ⬆ More spacing between boxes
                borderRadius: 8,
              }}
              onPress={() => router.push(`/quadra_screens/screen3?valveName=${valve}&nodeId=${selectedNode.id}`)}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>{valve}</Text>
            </Pressable>
          ))}
        </View>






        {/* Right Side: Flow Meter & Battery Voltage */}
        <View style={{ flex: 1, padding: 10, alignItems: 'center' }}> 
          {/* Changed justifyContent to alignItems for correct positioning */}
          
          {/* Flow Meter - MOVED DOWN */}
          <View style={{ backgroundColor: '#4CAF50', padding: 20, borderRadius: 8, marginTop: 50 }}>
            {/* ⬆ Added marginBottom to create space for Battery Voltage below */}
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Flow Meter</Text>
            <Text style={{ color: '#fff', fontSize: 14 }}>Value: 123 L/min</Text>
          </View>

          {/* Battery Voltage - MOVED BELOW FLOW METER */}
          <View style={{ backgroundColor: '#FF5722', padding: 20, borderRadius: 8, marginTop: 20  }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Battery Voltage</Text>
            <Text style={{ color: '#fff', fontSize: 14 }}>Value: 12.6V</Text>
          </View>
        </View>
      </View>
    </View>
  );
}



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







// import { View, Text, Pressable, ActivityIndicator } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';
// import { useRouter, useNavigation } from 'expo-router';
// import React, { useEffect, useState } from 'react';

// export default function Screen2() {
//   const { id } = useLocalSearchParams();
//   const nodeId = id ? Number(id) : null; // Ensure nodeId is valid  
//   const [nodes, setNodes] = useState([]);
//   const [valves, setValves] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();
//   const navigation = useNavigation();

//   // Hide the default header provided by React Navigation
//   React.useLayoutEffect(() => {
//     navigation.setOptions({ headerShown: false });
//   }, [navigation]);

//   // Fetch nodes and valves for the given node ID
//   useEffect(() => {
//     if (!nodeId) return; // Prevent fetch if id is invalid
  
//     setLoading(true);
//     setError(null);
  
//     fetch('http://192.168.1.45:5000/nodes')
//       .then((response) => response.json())
//       .then((data) => {
//         setNodes(data);
//         const node = data.find((node) => node.id === nodeId);
  
//         if (node) {
//           fetchValves(node.id);
//         } else {
//           setValves([]);
//           setLoading(false);
//         }
//       })
//       .catch((error) => {
//         setError('Error fetching nodes.');
//         setLoading(false);
//         console.error('Error fetching nodes:', error);
//       });
//   }, [nodeId]); 
  
  


//   // const fetchValves = (nodeId) => {
//   //   fetch(`http://192.168.31.115:5000/valves?nodeId=${nodeId}`)
//   //     .then((response) => response.json())
//   //     .then((data) => {
//   //       setValves(data);
//   //       setLoading(false);
//   //     })
//   //     .catch((error) => {
//   //       setError('Error fetching valves.');
//   //       setLoading(false);
//   //       console.error('Error fetching valves:', error);
//   //     });
//   // };
//   const fetchValves = (nodeId) => {
//     if (!nodeId) return; // Prevent invalid fetch
  
//     fetch(`http://192.168.31.115:5000/valves?nodeId=${nodeId}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setValves(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError('Error fetching valves.');
//         setLoading(false);
//         console.error('Error fetching valves:', error);
//       });
//   };
  

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#03A9F4" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
//       </View>
//     );
//   }

//   useEffect(() => {
//     console.log("Fetched Nodes:", nodes);
//   }, [nodes]);

//   useEffect(() => {
//     console.log("Fetched Valves:", valves);
//   }, [valves]);
  
//   useEffect(() => {
//     console.log("Updated Nodes:", nodes);
//   }, [nodes]);
  
//   useEffect(() => {
//     console.log("Updated Valves:", valves);
//   }, [valves]);
  
  
//   return (
//     <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
//       {/* HEADER SECTION */}
//       <View style={{ width: '100%', backgroundColor: 'white', paddingVertical: 10, alignItems: 'center', elevation: 4 }}>
//         <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Node Details</Text>
//       </View>

//       {/* Node Selection Buttons */}
//       <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
//       {nodes.map((node, index) => (
//   <Pressable
//     key={index}
//     style={{
//       zIndex: 1,
//       backgroundColor: node?.id === Number(id) ? '#c8a2c8' : '#03A9F4',
//       padding: 15,
//       margin: 8,
//       borderRadius: 8,
//       minWidth: 70,
//       alignItems: 'center',
//     }}
//     onPress={() => {
//       if (node?.id) {
//         router.replace(`/screen2?id=${node.id}`);
//       } else {
//         console.error("Node ID is undefined! Check node data.");
//       }
//     }}
    
    
//   >
//     <Text style={{ color: '#fff', fontSize: 16 }}>{node?.name || "Unnamed Node"}</Text>
//   </Pressable>
// ))}

//       </View>

//       {/* Valves and Sensor Boxes */}
//       <View style={{ flexDirection: 'row', flex: 1, padding: 10 }}>
//         {/* Left Side: Valves */}
//         <View style={{ flex: 1, padding: 10, marginRight: 20 }}>
//           <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Valves</Text>
//           {valves.length > 0 ? (
//             valves.map((valve, index) => (
//               <Pressable
//                 key={index}
//                 style={{
//                   backgroundColor: '#03A9F4',
//                   padding: 15,
//                   marginVertical: 8,
//                   borderRadius: 8,
//                 }}
//                 onPress={() => router.push(`/screen3?valveName=${valve.name}&nodeId=${id}`)}
//               >
//                 <Text style={{ color: '#fff', fontSize: 16 }}>{valve.name}</Text>
//               </Pressable>
//             ))
//           ) : (
//             <Text>No valves available for this node.</Text>
//           )}
//         </View>

//         {/* Right Side: Flow Meter & Battery Voltage */}
//         <View style={{ flex: 1, padding: 10, alignItems: 'center' }}>
//           <View style={{ backgroundColor: '#4CAF50', padding: 20, borderRadius: 8, marginBottom: 20 }}>
//             <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Flow Meter</Text>
//             <Text style={{ color: '#fff', fontSize: 14 }}>Value: 123 L/min</Text>
//           </View>
//           <View style={{ backgroundColor: '#FF5722', padding: 20, borderRadius: 8 }}>
//             <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Battery Voltage</Text>
//             <Text style={{ color: '#fff', fontSize: 14 }}>Value: 12.6V</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }














































