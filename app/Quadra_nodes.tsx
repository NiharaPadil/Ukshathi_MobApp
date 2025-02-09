// import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native';
// import { useRouter, useNavigation } from 'expo-router';
// import React, { useEffect, useState } from 'react';

// export default function Screen1() {
//   const router = useRouter();
//   const navigation = useNavigation();
  
//   const [nodes, setNodes] = useState([]);  // State to store nodes data
//   const [loading, setLoading] = useState(true); // State to track loading

//   // Fetch nodes from backend when the screen loads
//   useEffect(() => {
//     const fetchNodes = async () => {
//       try {
//         const response = await fetch('http://192.168.31.115:5000/nodes'); // Change IP
//         const data = await response.json();
//         setNodes(data);  // Update state with fetched data
//       } catch (error) {
//         console.error("Error fetching nodes:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNodes();
//   }, []);

//   // Hide the default header
//   React.useLayoutEffect(() => {
//     navigation.setOptions({ headerShown: false });
//   }, [navigation]);

//   return (
//     <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f0f0f0' }}>
//       {/* HEADER SECTION */}
//       <View style={{ width: '100%', backgroundColor: 'white', paddingVertical: 20, alignItems: 'center', elevation: 4 }}>
//         <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Nodes</Text>
//       </View>

//       {/* USER INFO SECTION */}
//       <View style={{ width: '100%', marginTop: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
//         <Text style={{ fontSize: 18, marginRight: 10 }}>Hello User</Text>
//         <Image source={require('../assets/images/user-icon.png')} style={{ width: 24, height: 24 }} />
//       </View>

//       {/* NODE LIST SECTION */}
//       <View style={{ marginTop: 100 }}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#03A9F4" /> // Show loader while fetching
//         ) : (
//           nodes.map((node, index) => (
//             <Pressable
//               key={node.id ?? `node-${index}`}  // Use `node.id` if available; otherwise, fallback to a unique key
//               style={{
//                 backgroundColor: '#03A9F4',
//                 padding: 15,
//                 marginVertical: 8,
//                 borderRadius: 8,
//                 width: 200,
//                 alignItems: 'center',
//               }}
//               onPress={() => router.push(``)}
//             >
//               <Text style={{ color: '#fff', fontSize: 18 }}>{node.name}</Text>
//             </Pressable>
//           ))
          
          
//         )}
//       </View>
//     </View>
//   );
// }




// import { View, Text, Pressable, Image } from 'react-native'; // Importing UI components from React Native
// import { useRouter, useNavigation } from 'expo-router'; // Importing routing and navigation hooks from Expo Router
// import React from 'react';

// // Define an array of nodes (each node has an id and name)
// const nodes = [
//   { id: 1, name: 'Node 1' },
//   { id: 2, name: 'Node 2' },
//   { id: 3, name: 'Node 3' },
//   { id: 4, name: 'Node 4' },
// ];

// export default function Screen1() {
//   const router = useRouter(); // Hook to handle navigation between screens
//   const navigation = useNavigation(); // Hook to access screen navigation properties

//   // Hide the default header provided by React Navigation
//   React.useLayoutEffect(() => {
//     navigation.setOptions({ headerShown: false });
//   }, [navigation]);

//   return (
//     // Main container with a light gray background and centered alignment
//     <View // Start of a View component
//     style={{ // Beginning of style object
//         flex: 1, // Makes the View take up the full space of its parent
//          alignItems: 'center', // Centers child components along the cross axis (horizontally)
//          backgroundColor: '#f0f0f0' // Sets the background color to a light grey
//           }}
//           > 

      

//       {/* HEADER SECTION */}
//       {/* Displays a white header bar with the title "Nodes" in the center */}
//       <View 
//          style= // Start of the style object
//          {{ 
//             width: '100%', // The View takes up the full width of its parent
//             backgroundColor: 'white', // Sets the background color to white
//             paddingVertical: 20, // Adds 20 points of padding to the top and bottom of the View
//             alignItems: 'center', // Centers child components along the cross axis (horizontally)
//             elevation: 4 // Adds a shadow effect (Android-only)
//         }}>
//         <Text 
//            style=
//              {{ 
//               fontSize: 22, // Sets the font size to 22 points
//               fontWeight: 'bold' // Makes the text bold
//         }}>Nodes</Text>
//      </View>




//       {/* USER INFO SECTION (Positioned below the header, aligned to the right) */}
//       <View 
//         style=
//           {{ 
//             width: '100%', // The View takes up the full width of its parent
//             marginTop: 20, // Adds a margin of 20 points above the View
//             paddingHorizontal: 20, // Adds 20 points of padding to the left and right of the View
//             flexDirection: 'row', // Arranges child components in a row (horizontally)
//             justifyContent: 'flex-end', // Aligns child components to the end of the main axis (to the right)
//             alignItems: 'center' // Centers child components along the cross axis (vertically)
//             }}
//             >
//         <Text 
//           style=
//            {{ 
//             fontSize: 18, // Sets the font size to 18 points
//             marginRight: 10 // Adds a margin of 10 points to the right of the Text component 
//             }}>Hello User</Text>
            
//         <Image source={require('../assets/images/user-icon.png')} style={{ width: 24, height: 24 }} />
//         {/* The Image component displays an icon with a width and height of 24 points */}
//       </View>




//       {/* NODE LIST SECTION (Buttons representing different nodes) */}
//       <View style={{ marginTop: 100 }}>  
//         {nodes.map((node) => (
//           // Each node is a button that navigates to another screen when clicked
//           <Pressable
//             key={node.id} // Unique key for React list rendering optimization
//             style={{
//               backgroundColor: '#03A9F4', // Blue background color for the button
//               padding: 15, // Padding inside the button
//               marginVertical: 8, // Spacing between buttons
//               borderRadius: 8, // Rounded corners
//               width: 200, // Fixed width for consistent size
//               alignItems: 'center', // Center align text inside the button
//             }}
//             onPress={() => router.push(`/screen2?id=${node.id}`)} // Navigate to screen2 with the node's id
//           >
//             <Text style={{ color: '#fff', fontSize: 18 }}>{node.name}</Text>
//           </Pressable>
//         ))}
//       </View>

//     </View>
//   );
// }





//limas code:
import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';

export default function Screen1() {
  const router = useRouter();
  const [nodes, setNodes] = useState([]); // State to store fetched nodes
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch('http://192.168.131.23:5000/nodes'); // Use your local IP instead of "localhost"
        const data = await response.json();
        setNodes(data); // Store fetched data in state
      } catch (error) {
        console.error('Error fetching nodes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      {/* HEADER */}
      <View style={{ width: '100%', backgroundColor: 'white', paddingVertical: 20, alignItems: 'center', elevation: 4 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Nodes</Text>
      </View>

      {/* USER INFO */}
      <View style={{ width: '100%', marginTop: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginRight: 10 }}>Hello User</Text>
        <Image source={require('../assets/images/Uno.jpg')} style={{ width: 24, height: 24 }} />
      </View>

      {/* NODE LIST */}
      <View style={{ marginTop: 100 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#03A9F4" />
        ) : (
          nodes.map((node: { id: number; name: string }) => (
            <Pressable
              key={node.id}
              style={{ backgroundColor: '#03A9F4', padding: 15, marginVertical: 8, borderRadius: 8, width: 200, alignItems: 'center' }}
              onPress={() => router.push(`./quadra_screens/screen2?id=${node.id}`)}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>{node.name}</Text>
            </Pressable>
          ))
        )}
      </View>
    </View>
  );
}
