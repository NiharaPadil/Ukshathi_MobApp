// app/(pages)/footer.js
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Footer = ({ activeTab }) => {
  const router = useRouter();

  const tabs = [
    { key: 'Landing', label: 'Home', icon: 'home' },
    { key: 'NotificationsScreen', label: 'Notification', icon: 'bell' },
    { key: 'ContactScreen', label: 'Contact', icon: 'phone' },
    { key: 'Queries', label: 'Queries', icon: 'message-text' },
  ];

  return (
    <View style={styles.footer}>
      {tabs.map((tab) => (
        <Pressable key={tab.key} onPress={() => router.push(`/${tab.key}`)} style={styles.tab}>
          <MaterialCommunityIcons
            name={tab.icon}
            size={24}
            color={activeTab === tab.key ? '#2D5A3D' : '#888'}
          />
          <Text style={{ color: activeTab === tab.key ? '#2D5A3D' : '#888' }}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tab: {
    alignItems: 'center',
  },
});

export default Footer;
