// components/Footer.js
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Footer = ({ activeTab = 'Landing' }) => {
  const router = useRouter();

  const tabs = [
    { key: 'Landing', label: 'Home', icon: 'home', route: '/Landing' },
    { key: 'Notifications', label: 'Notification', icon: 'bell', route: '/NotificationsScreen' },
    { key: 'Contact', label: 'Contact', icon: 'phone', route: '/ContactScreen' },
    { key: 'Queries', label: 'Queries', icon: 'message-text', route: '/Queries' },
  ];

  const handleTabPress = (tab) => {
    // Only navigate if it's not already the active tab
    if (activeTab !== tab.key) {
      router.push(tab.route);
    }
  };

  return (
    <View style={styles.footerContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => handleTabPress(tab)}
            style={({ pressed }) => [
              styles.footerTab,
              isActive && styles.footerTabActive,
              pressed && styles.footerTabPressed,
            ]}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={28}
              color={isActive ? '#388E3C' : '#666'}
            />
            <Text style={[styles.footerLabel, isActive && styles.footerLabelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: '#f9f9f9',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
  },
  footerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  footerTabActive: {
    borderTopWidth: 3,
    borderTopColor: '#388E3C',
  },
  footerTabPressed: {
    opacity: 0.6,
  },
  footerLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    fontWeight: '500',
  },
  footerLabelActive: {
    color: '#388E3C',
    fontWeight: '700',
  },
});

export default Footer;