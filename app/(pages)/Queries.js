import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,KeyboardAvoidingView,Platform, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

const QueriesPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    queryType: '',
    message: '',
    image: null,
    feedback: '',
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    const { name, email, queryType, message, image, feedback } = formData;

    if (!name || !email || !queryType || !message) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const form = new FormData();
    form.append('name', name);
    form.append('email', email);
    form.append('queryType', queryType);
    form.append('message', message);
    form.append('feedback', feedback);

    if (image) {
      const file = {
        uri: image,
        name: image.split('/').pop(),
        type: 'image/jpeg',
      };
      form.append('image', file);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/queries/submit`, {
        method: 'POST',
        body: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', result.message);
        setFormData({
          name: '',
          email: '',
          queryType: '',
          message: '',
          image: null,
          feedback: '',
        });
      } else {
        Alert.alert('Error', result.error || 'Failed to submit data');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Failed to connect to the server');
    }
  };

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1,padding: 20,backgroundColor: '#F5F5F5',marginTop: 40,marginBottom:20}}
    >
    <ScrollView style={styles.container}>
      {/* Queries Section */}
      <Text style={styles.header}>Queries Section</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Query Type (e.g., Technical, Billing)"
        value={formData.queryType}
        onChangeText={(text) => setFormData({ ...formData, queryType: text })}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Your Message"
        value={formData.message}
        onChangeText={(text) => setFormData({ ...formData, message: text })}
        multiline
      />

      {/* Image Upload */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <MaterialIcons name="cloud-upload" size={24} color="#4CAF50" />
        <Text style={styles.uploadText}>
          {formData.image ? 'Image Uploaded' : 'Upload Image'}
        </Text>
      </TouchableOpacity>

      {formData.image && (
        <Image source={{ uri: formData.image }} style={styles.imagePreview} />
      )}

      {/* Feedback Section */}
      <Text style={styles.header}>Feedback Section</Text>

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Your Feedback"
        value={formData.feedback}
        onChangeText={(text) => setFormData({ ...formData, feedback: text })}
        multiline
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  uploadText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4CAF50',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QueriesPage;