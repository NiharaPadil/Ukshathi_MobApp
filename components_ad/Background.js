// BackgroundImage.js
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const BackgroundImage = ({ children }) => {
  return (
    <ImageBackground
      source={require('../assets/images/Background.jpg')} // Replace with your image path
      style={styles.background}
      resizeMode="cover" // Ensures the image covers the entire screen
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default BackgroundImage;