// footer.jsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const tabs = [
  { name: 'About Us', icon: (color, size) => <MaterialIcons name="info" size={size} color={color} />, route: 'about-us' },
  { name: 'Notifications', icon: (color, size) => <Ionicons name="notifications" size={size} color={color} />, route: 'notifications' },
  { name: 'Contact', icon: (color, size) => <FontAwesome5 name="phone" size={size} color={color} />, route: 'contact' },
  { name: 'Queries', icon: (color, size) => <MaterialCommunityIcons name="comment-question" size={size} color={color} />, route: 'queries' },
];

export default function Footer({ currentRoute, onTabPress }) {
  const [selected, setSelected] = useState(currentRoute || 'about-us');

  const handlePress = (route) => {
    setSelected(route);
    if (onTabPress) onTabPress(route);
  };

  return (
    <View style={styles.footerContainer}>
      {tabs.map((tab) => {
        const focused = selected === tab.route;
        const color = focused ? '#3CB371' : '#999';
        const scale = focused ? 1.2 : 1;

        return (
          <Pressable
            key={tab.route}
            onPress={() => handlePress(tab.route)}
            style={styles.tabButton}
          >
            <Animated.View style={{ transform: [{ scale }] }}>
              {tab.icon(color, 28)}
              <Text style={[styles.tabText, { color }]}>{tab.name}</Text>
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    elevation: 10,
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
});
