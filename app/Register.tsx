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
  // State variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [devices, setDevices] = useState([""]); // Array of device types

  interface Controller {
    id: string; // Manually provided ID
    name: string;
    deviceType: string;
    nodes: {
      id: string; // Manually provided ID
      name: string;
      batteryVoltage: string;
      valves: {
        id: string; // Manually provided ID
        name: string;
      }[];
    }[];
  }

  const [controllers, setControllers] = useState<Controller[]>([]); // For Quadra devices
  const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? "";

  // Device options
  const deviceOptions = ["Uno", "Quadra", "Hexa", "Octa"];

  // Handle signup
  const handleSignup = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNumber ||
      !address ||
      !city ||
      !state ||
      devices.some((device) => !device)
    ) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phoneNumber,
          address,
          city,
          state,
          devices,
          controllers,
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

  // Handle adding a new device
  const handleAddDevice = () => {
    setDevices([...devices, ""]);
  };

  // Handle removing a device
  const handleRemoveDevice = (index: number) => {
    const updatedDevices = devices.filter((_, i) => i !== index);
    setDevices(updatedDevices);
  };

  // Handle device type change
  const handleDeviceChange = (index: number, value: string) => {
    const updatedDevices = [...devices];
    updatedDevices[index] = value;
    setDevices(updatedDevices);

    // If Quadra is selected, initialize controllers
    if (value === "Quadra") {
      setControllers([{ id: "", name: "", deviceType: "Quadra", nodes: [] }]);
    } else {
      setControllers([]);
    }
  };

  // Handle adding a new controller
  const handleAddController = () => {
    setControllers([...controllers, { id: "", name: "", deviceType: "Quadra", nodes: [] }]);
  };

  // Handle removing a controller
  const handleRemoveController = (index: number) => {
    const updatedControllers = controllers.filter((_, i) => i !== index);
    setControllers(updatedControllers);
  };

  // Handle controller ID change
  const handleControllerIdChange = (index: number, value: string) => {
    const updatedControllers = [...controllers];
    updatedControllers[index].id = value;
    setControllers(updatedControllers);
  };

  // Handle controller name change
  const handleControllerNameChange = (index: number, value: string) => {
    const updatedControllers = [...controllers];
    updatedControllers[index].name = value;
    setControllers(updatedControllers);
  };

  // Handle adding a new node
  const handleAddNode = (controllerIndex: number) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes.push({
      id: "", // Manually provided ID
      name: "",
      batteryVoltage: "",
      valves: [],
    });
    setControllers(updatedControllers);
  };

  // Handle removing a node
  const handleRemoveNode = (controllerIndex: number, nodeIndex: number) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes = updatedControllers[
      controllerIndex
    ].nodes.filter((_, i) => i !== nodeIndex);
    setControllers(updatedControllers);
  };

  // Handle node ID change
  const handleNodeIdChange = (controllerIndex: number, nodeIndex: number, value: string) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes[nodeIndex].id = value;
    setControllers(updatedControllers);
  };

  // Handle node name change
  const handleNodeNameChange = (controllerIndex: number, nodeIndex: number, value: string) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes[nodeIndex].name = value;
    setControllers(updatedControllers);
  };

  // Handle battery voltage change
  const handleBatteryVoltageChange = (controllerIndex: number, nodeIndex: number, value: string) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes[nodeIndex].batteryVoltage = value;
    setControllers(updatedControllers);
  };

  // Handle adding a new valve
  const handleAddValve = (controllerIndex: number, nodeIndex: number) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes[nodeIndex].valves.push({
      id: "", // Manually provided ID
      name: "",
    });
    setControllers(updatedControllers);
  };

  // Handle removing a valve
  const handleRemoveValve = (controllerIndex: number, nodeIndex: number, valveIndex: number) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes[nodeIndex].valves = updatedControllers[
      controllerIndex
    ].nodes[nodeIndex].valves.filter((_, i) => i !== valveIndex);
    setControllers(updatedControllers);
  };

  // Handle valve ID change
  const handleValveIdChange = (controllerIndex: number, nodeIndex: number, valveIndex: number, value: string) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes[nodeIndex].valves[valveIndex].id = value;
    setControllers(updatedControllers);
  };

  // Handle valve name change
  const handleValveNameChange = (controllerIndex: number, nodeIndex: number, valveIndex: number, value: string) => {
    const updatedControllers = [...controllers];
    updatedControllers[controllerIndex].nodes[nodeIndex].valves[valveIndex].name = value;
    setControllers(updatedControllers);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/images/logowithleaf.png")}
        style={styles.logoImage}
      />

      {/* Header */}
      <Text style={styles.header}>Sign Up</Text>

      {/* Personal Information */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
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
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="State"
        value={state}
        onChangeText={setState}
      />

      {/* Device Configuration */}
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
                    placeholder="Controller ID"
                    value={controller.id}
                    onChangeText={(value) =>
                      handleControllerIdChange(cIndex, value)
                    }
                  />
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

                  {controller.nodes.map((node, nIndex) => (
                    <View key={nIndex} style={styles.nodeContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Node ID"
                        value={node.id}
                        onChangeText={(value) =>
                          handleNodeIdChange(cIndex, nIndex, value)
                        }
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Node Name"
                        value={node.name}
                        onChangeText={(value) =>
                          handleNodeNameChange(cIndex, nIndex, value)
                        }
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Battery Voltage"
                        value={node.batteryVoltage}
                        onChangeText={(value) =>
                          handleBatteryVoltageChange(cIndex, nIndex, value)
                        }
                        keyboardType="numeric"
                      />
                      <TouchableOpacity
                        onPress={() => handleRemoveNode(cIndex, nIndex)}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteButtonText}>Remove Node</Text>
                      </TouchableOpacity>

                      {node.valves.map((valve, vIndex) => (
                        <View key={vIndex} style={styles.valveContainer}>
                          <TextInput
                            style={styles.input}
                            placeholder="Valve ID"
                            value={valve.id}
                            onChangeText={(value) =>
                              handleValveIdChange(cIndex, nIndex, vIndex, value)
                            }
                          />
                          <TextInput
                            style={styles.input}
                            placeholder={`Valve ${vIndex + 1} Name`}
                            value={valve.name}
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

      {/* Add Device Button */}
      <TouchableOpacity onPress={handleAddDevice} style={styles.addDeviceButton}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity onPress={handleSignup} style={styles.SignInButton}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles
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