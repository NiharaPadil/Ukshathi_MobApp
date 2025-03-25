import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface HistoryButtonProps {
  onPress: () => void;
}

export default function HistoryButton({ onPress }: HistoryButtonProps) {
  return (
    <Pressable style={styles.historyButton} onPress={onPress}>
      <Text style={styles.historyButtonText}>View History</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  historyButton: {
    marginTop: 25,
    backgroundColor: '#809c13',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});