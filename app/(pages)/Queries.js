// Queries.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
  Image, StyleSheet, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Footer from '../(pages)/footer'; // Adjust path as per your project structure

const FOOTER_HEIGHT = 70;
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
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: FOOTER_HEIGHT + 20 }]}
          showsVerticalScrollIndicator={false}
        >
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
            style={[styles.input, styles.messageInput]}
            placeholder="Your Message"
            value={formData.message}
            onChangeText={(text) => setFormData({ ...formData, message: text })}
            multiline
          />

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <MaterialIcons name="cloud-upload" size={24} color="#388E3C" />
            <Text style={styles.uploadText}>
              {formData.image ? 'Image Uploaded' : 'Upload Image'}
            </Text>
          </TouchableOpacity>

          {formData.image && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: formData.image }} style={styles.previewImage} />
            </View>
          )}

          <TextInput
            style={[styles.input, styles.feedbackInput]}
            placeholder="Feedback (optional)"
            value={formData.feedback}
            onChangeText={(text) => setFormData({ ...formData, feedback: text })}
            multiline
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Query</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Unified Footer */}
      <Footer activeTab="Queries" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#2D5A3D',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
    messageInput: {
      height: 100,
    },
  });
  
  export default QueriesPage;