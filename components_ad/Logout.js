// components_ad/Logout.js
import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';

const LogoutButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        source={require('../assets/images/logout.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.label}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
  },
  image: {
    width: 40,
    height: 40,
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
});

export default LogoutButton;
