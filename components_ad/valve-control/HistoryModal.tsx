import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';

interface HistoryModalProps {
  visible: boolean;
  data: Array<{
    valveID: string | number;
    wateredDateTime: string;
    wateredDuration: string | null;
    waterVolume: string | null;
  }>;
  onClose: () => void;
}

export default function HistoryModal({ visible, data, onClose }: HistoryModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>History</Text>
          {data.length > 0 ? (
            data.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text>Time: {item.wateredDateTime}</Text>
                <Text>Duration: {item.wateredDuration ?? 'N/A'}</Text>
                <Text>Water Volume: {item.waterVolume ?? 'N/A'}</Text>
              </View>
            ))
          ) : (
            <Text>No history available</Text>
          )}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  historyItem: {
    backgroundColor: '#ddd',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#809c13',
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
    width: 150,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});