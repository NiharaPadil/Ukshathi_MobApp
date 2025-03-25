import React, { useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TimePickerProps {
  wateringTime: Date;
  onTimeChange: (event: any, selectedTime?: Date) => void;
}

export default function TimePicker({ wateringTime, onTimeChange }: TimePickerProps) {
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <View style={styles.controlSection}>
      <Text style={styles.sectionTitle}>Schedule Watering Time:</Text>
      <Pressable style={styles.button} onPress={() => setShowTimePicker(true)}>
        <Text style={styles.buttonText}>
          {wateringTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.buttonSubText}>Edit Time</Text>
      </Pressable>
      {showTimePicker && (
        <DateTimePicker
          value={wateringTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            onTimeChange(event, selectedTime);
          }}
        />
      )}
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
  buttonSubText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginTop: 4,
  },
});