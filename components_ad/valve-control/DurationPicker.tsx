import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface DurationPickerProps {
  duration: number;
  onDurationChange: (duration: number) => void;
}

export default function DurationPicker({ duration, onDurationChange }: DurationPickerProps) {
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  return (
    <View style={styles.controlSection}>
      <Text style={styles.sectionTitle}>Set Watering Duration:</Text>
      <Pressable style={styles.button} onPress={() => setShowDurationPicker(true)}>
        <Text style={styles.buttonText}>{duration} min</Text>
      </Pressable>
      <Modal visible={showDurationPicker} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Watering Duration</Text>
            <Picker
              selectedValue={duration}
              style={styles.picker}
              onValueChange={(itemValue) => onDurationChange(itemValue)}
            >
              {[...Array(60).keys()].map((minute) => (
                <Picker.Item key={minute} label={`${minute + 1} min`} value={minute + 1} />
              ))}
            </Picker>
            <Pressable
              style={styles.confirmButton}
              onPress={() => setShowDurationPicker(false)}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  controlSection: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#809c13',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    height: 200,
  },
  confirmButton: {
    backgroundColor: '#809c13',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});