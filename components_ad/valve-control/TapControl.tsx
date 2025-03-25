import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

interface TapControlProps {
  isTapOn: boolean;
  onToggle: (value: boolean) => void;
}

export default function TapControl({ isTapOn, onToggle }: TapControlProps) {
  return (
    <View style={styles.tapControlContainer}>
      <Text style={styles.tapControlTitle}>Tap Control</Text>
      <Text style={styles.statusText}>Status: Tap is {isTapOn ? 'ON' : 'OFF'}</Text>
      <View style={styles.tapControlToggle}>
        <Text style={styles.tapControlText}>{isTapOn ? 'ON' : 'OFF'}</Text>
        <Switch value={isTapOn} onValueChange={onToggle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tapControlContainer: {
    marginTop: -60,
    width: 200,
    backgroundColor: '#809c13',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tapControlTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  tapControlToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    width: '100%',
    justifyContent: 'center',
  },
  tapControlText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
});