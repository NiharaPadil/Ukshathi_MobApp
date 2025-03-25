// components/BackButton.jsx
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const BackButton = ({ onPress }) => {
  return (
    <Pressable style={styles.backButton} onPress={onPress}>
      <Ionicons name="arrow-back" size={40} color="#337a2c" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'end',
    paddingTop: 40,
    zIndex: 1,
  },
});

export default BackButton;