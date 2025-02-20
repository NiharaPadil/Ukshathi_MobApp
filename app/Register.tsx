

// import React, { useState } from "react";
// import { View, TextInput, Alert, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
// import Constants from 'expo-constants';
// import { Picker } from '@react-native-picker/picker';

// const Register = () => {
//   const [name, setName] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [email, setEmail] = useState<string>(""); 
//   const [devices, setDevices] = useState<string[]>([""]); 
//   const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

//   const deviceOptions = ["Uno", "Quadra", "Hexa", "Octa"]; //device types

//   const handleSignup = async () => {
//     if (!name || !email || !password || devices.some(device => !device)) {
//       Alert.alert("Error", "Please fill in all the fields.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/signup`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password, device_types: devices }),
//       });

//       const data = await response.json();
//       console.log("Response Data:", data);

//       if (response.ok) {
//         Alert.alert("Signup Successful", "Your account has been created.");
//       } else {
//         Alert.alert("Error", data.message || "Failed to sign up.");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Something went wrong. Please try again.");
//     }
//   };


//   //for handling multple devices
//   const handleAddDevice = () => {
//     setDevices([...devices, ""]);
//   };

//   const handleRemoveDevice = (index: number) => {
//     const updatedDevices = devices.filter((_, i) => i !== index);
//     setDevices(updatedDevices);
//   };

//   const handleDeviceChange = (index: number, value: string) => {
//     const updatedDevices = [...devices];
//     updatedDevices[index] = value;
//     setDevices(updatedDevices);
//   };

//   return (
//     <View style={styles.container}>
//       <Image source={require('../assets/images/logowithleaf.png')} style={styles.logoImage} />
//       <Text style={styles.header}>Sign Up</Text>
      
//       <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
//       <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
//       <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

//       {devices.map((device, index) => (
//         <View key={index} style={styles.deviceContainer}>
//           <Text style={styles.deviceLabel}>Product Type {index + 1}</Text>
//           <View style={styles.deviceRow}>
//             <Picker
//               selectedValue={device}
//               style={styles.picker}
//               onValueChange={(value) => handleDeviceChange(index, value)}
//             >
//               <Picker.Item label="Select Product Type" value="" />
//               {deviceOptions.map((option, idx) => (
//                 <Picker.Item key={idx} label={option} value={option} />
//               ))}
//             </Picker>
//             {devices.length > 1 && (
//               <TouchableOpacity onPress={() => handleRemoveDevice(index)} style={styles.deleteButton}>
//                 <Text style={styles.deleteButtonText}>X</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       ))}

//       <TouchableOpacity onPress={handleAddDevice} style={styles.addDeviceButton}>
//         <Text style={styles.buttonText}>Add Prouct</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={handleSignup} style={styles.SignInButton}>
//         <Text style={styles.buttonText}>Register</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     top: -25,
//     justifyContent: 'center',
//     padding: 16,
//     backgroundColor: '#f3f7ea',
//   },
//   logoImage: {
//     width: '80%',
//     height: '20%',
//     alignSelf: 'center',
//   },
//   header: {
//     fontSize: 30,
//     textAlign: "center",
//     marginBottom: 20,
//     fontWeight: "bold",
//   },
//   input: {
//     height: 50,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     marginBottom: 15,
//     paddingLeft: 10,
//     borderRadius: 5,
//   },
//   deviceContainer: {
//     borderColor: "#ddd",
//     borderWidth: 1,
//     marginBottom: 15,
//     padding: 10,
//     borderRadius: 5,
//   },
//   deviceLabel: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   deviceRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   picker: {
//     flex: 1,
//     height: 50,
//   },
//   deleteButton: {
//     marginLeft: 10,
//     backgroundColor: "#ff4d4d",
//     padding: 10,
//     borderRadius: 5,
//   },
//   deleteButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   addDeviceButton: {
//     backgroundColor: '#1e7218',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//     width: '90%',
//     alignSelf: 'center',
//   },
//   SignInButton: {
//     backgroundColor: '#1e7218',
//     padding: 15,
//     borderRadius: 5,
//     marginBottom: 10,
//     width: '90%',
//     alignSelf: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
// });

import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { Picker } from "@react-native-picker/picker";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [devices, setDevices] = useState<string[]>([""]);
  const [controllers, setControllers] = useState<any[]>([]); // For Quadra devices
  const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? "";

  const deviceOptions = ["Uno", "Quadra", "Hexa", "Octa"]; // Device types

  const handleSignup = async () => {
    if (!name || !email || !password || devices.some((device) => !device)) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          device_types: devices,
          controllers, // Include controllers for Quadra devices
        }),
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok) {
        Alert.alert("Signup Successful", "Your account has been created.");
      } else {
        Alert.alert("Error", data.message || "Failed to sign up.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  // For handling multiple devices
  const handleAddDevice = () => {
    setDevices([...devices, ""]);
  };

  const handleRemoveDevice = (index: number) => {
    const updatedDevices = devices.filter((_, i) => i !== index);
    setDevices(updatedDevices);
  };

  const handleDeviceChange = (index: number, value: string) => {
    const updatedDevices = [...devices];
    updatedDevices[index] = value;
    setDevices(updatedDevices);

    // If Quadra is selected, initialize controllers
    if (value === "Quadra") {
      setControllers([{ name: "", nodes: [] }]);
    } else {
      setControllers([]);
    }
  };

  // For handling Quadra device controllers
  const handleAddController = () => {
    setControllers([...controllers, { name: "", nodes: [] }]);
  };

  const handleRemoveController = (index: number) => {
    const updatedControllers = controllers.filter((_, i) => i !== index);
    setControllers(updatedControllers);
  };

  const handleControllerNameChange = (index: number, value: string) => {
    const updatedControllers = [...controllers];
    updatedControllers[index].name = value;
    setControllers(updatedControllers);
  };

  const handleAddNode = (controllerIndex: number) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes.push({ name: "", valves: [] });
    setControllers(updatedControllers);
  };

  const handleRemoveNode = (controllerIndex: number, nodeIndex: number) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes = updatedControllers[
      controllerIndex
    ].nodes.filter((_: any, i: number) => i !== nodeIndex);
    setControllers(updatedControllers);
  };

  const handleNodeNameChange = (
    controllerIndex: number,
    nodeIndex: number,
    value: string
  ) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes[nodeIndex].name = value;
    setControllers(updatedControllers);
  };

  const handleAddValve = (controllerIndex: number, nodeIndex: number) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes[nodeIndex].valves.push("");
    setControllers(updatedControllers);
  };

  const handleRemoveValve = (
    controllerIndex: number,
    nodeIndex: number,
    valveIndex: number
  ) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes[nodeIndex].valves = updatedControllers[
      controllerIndex
    ].nodes[nodeIndex].valves.filter((_: any, i: number) => i !== valveIndex);
    setControllers(updatedControllers);
  };

  const handleValveNameChange = (
    controllerIndex: number,
    nodeIndex: number,
    valveIndex: number,
    value: string
  ) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes[nodeIndex].valves[valveIndex] = value;
    setControllers(updatedControllers);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/images/logowithleaf.png")}
        style={styles.logoImage}
      />
      <Text style={styles.header}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {devices.map((device, index) => (
        <View key={index} style={styles.deviceContainer}>
          <Text style={styles.deviceLabel}>Product Type {index + 1}</Text>
          <View style={styles.deviceRow}>
            <Picker
              selectedValue={device}
              style={styles.picker}
              onValueChange={(value) => handleDeviceChange(index, value)}
            >
              <Picker.Item label="Select Product Type" value="" />
              {deviceOptions.map((option, idx) => (
                <Picker.Item key={idx} label={option} value={option} />
              ))}
            </Picker>
            {devices.length > 1 && (
              <TouchableOpacity
                onPress={() => handleRemoveDevice(index)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Quadra Device Configuration */}
          {device === "Quadra" && (
            <View style={styles.quadraContainer}>
              {controllers.map((controller, cIndex) => (
                <View key={cIndex} style={styles.controllerContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Controller Name"
                    value={controller.name}
                    onChangeText={(value) =>
                      handleControllerNameChange(cIndex, value)
                    }
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveController(cIndex)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Remove Controller</Text>
                  </TouchableOpacity>

                  {controller.nodes.map((node: any, nIndex: number) => (
                    <View key={nIndex} style={styles.nodeContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Node Name"
                        value={node.name}
                        onChangeText={(value) =>
                          handleNodeNameChange(cIndex, nIndex, value)
                        }
                      />
                      <TouchableOpacity
                        onPress={() => handleRemoveNode(cIndex, nIndex)}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteButtonText}>Remove Node</Text>
                      </TouchableOpacity>

                      {node.valves.map((valve: string, vIndex: number) => (
                        <View key={vIndex} style={styles.valveContainer}>
                          <TextInput
                            style={styles.input}
                            placeholder={`Valve ${vIndex + 1} Name`}
                            value={valve}
                            onChangeText={(value) =>
                              handleValveNameChange(cIndex, nIndex, vIndex, value)
                            }
                          />
                          <TouchableOpacity
                            onPress={() =>
                              handleRemoveValve(cIndex, nIndex, vIndex)
                            }
                            style={styles.deleteButton}
                          >
                            <Text style={styles.deleteButtonText}>Remove Valve</Text>
                          </TouchableOpacity>
                        </View>
                      ))}

                      <TouchableOpacity
                        onPress={() => handleAddValve(cIndex, nIndex)}
                        style={styles.addButton}
                      >
                        <Text style={styles.addButtonText}>Add Valve</Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() => handleAddNode(cIndex)}
                    style={styles.addButton}
                  >
                    <Text style={styles.addButtonText}>Add Node</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                onPress={handleAddController}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Add Controller</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity onPress={handleAddDevice} style={styles.addDeviceButton}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignup} style={styles.SignInButton}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f3f7ea",
  },
  logoImage: {
    width: "80%",
    height: 100,
    alignSelf: "center",
    resizeMode: "contain",
  },
  header: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  deviceContainer: {
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  deviceLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    flex: 1,
    height: 50,
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addDeviceButton: {
    backgroundColor: "#1e7218",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "90%",
    alignSelf: "center",
  },
  SignInButton: {
    backgroundColor: "#1e7218",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: "90%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  quadraContainer: {
    marginTop: 10,
  },
  controllerContainer: {
    marginBottom: 15,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  nodeContainer: {
    marginLeft: 10,
    marginBottom: 10,
    padding: 10,
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 5,
  },
  valveContainer: {
    marginLeft: 20,
    marginBottom: 10,
    padding: 10,
    borderColor: "#f5f5f5",
    borderWidth: 1,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#1e7218",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Register;