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
          contentContainerStyle={styles.scrollContainer}
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
            placeholder="Query Type"
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
            <MaterialIcons name="cloud-upload" size={22} color="#fff" />
            <Text style={styles.uploadText}>Upload Image (Optional)</Text>
          </TouchableOpacity>

          {formData.image && (
            <Image source={{ uri: formData.image }} style={styles.previewImage} />
          )}

          <TextInput
            style={[styles.input, styles.feedbackInput]}
            placeholder="Additional Feedback (Optional)"
            value={formData.feedback}
            onChangeText={(text) => setFormData({ ...formData, feedback: text })}
            multiline
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Query</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </View>
  );
};

export default QueriesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: FOOTER_HEIGHT + 20,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    color: 'green',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  feedbackInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    justifyContent: 'center',
  },
  uploadText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 15,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerContainer: {
    height: FOOTER_HEIGHT,
  },
});
