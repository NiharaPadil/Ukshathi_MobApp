import React, { createContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Handle notifications when app is in foreground
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(handleNotification);

    return () => subscription.remove();
  }, []);

  const handleNotification = (notification) => {
    // Show immediate popup
    Alert.alert(
      notification.request.content.title,
      notification.request.content.body,
      [{ text: 'OK', onPress: () => markAsRead(notification) }]
    );

    // Add to notifications list
    setNotifications(prev => [{
      id: notification.request.identifier,
      title: notification.request.content.title,
      body: notification.request.content.body,
      is_read: false,
      created_at: new Date().toISOString()
    }, ...prev]);
    
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = async (notification) => {
    try {
      await axios.patch(`/notifications/${notification.request.identifier}/read`);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.request.identifier ? {...n, is_read: true} : n
        )
      );
      setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};