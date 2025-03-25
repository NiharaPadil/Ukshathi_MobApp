import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusIndicatorProps {
  scheduleStatus: {
    status: string;
    lastUpdated: string;
  };
}

export default function StatusIndicator({ scheduleStatus }: StatusIndicatorProps) {
  return (
    <View style={styles.statusContainer}>
      <Text style={styles.statusLabel}>Schedule Status:</Text>
      <View
        style={[
          styles.statusIndicator,
          scheduleStatus.status === 'Updated' ? styles.updated : styles.error,
        ]}
      >
        <Text style={styles.statusText}>{scheduleStatus.status}</Text>
      </View>
      <Text style={styles.statusTime}>
        Last updated: {scheduleStatus.lastUpdated}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  statusIndicator: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  updated: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#f44336',
  },
});