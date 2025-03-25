import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface LiveValveStatusProps {
  status: { message: string; color: string };
  onPress: () => void;
}

export default function LiveValveStatus({ status, onPress }: LiveValveStatusProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>LIVE VALVE STATUS:</Text>
      <Pressable
        style={[styles.button, { backgroundColor: status.color }]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{status.message}</Text>
      </Pressable>
      <Text style={[styles.statusMessage, { color: status.color }]}>
        {status.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: -110,
    marginBottom: 120,
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
  statusMessage: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
});