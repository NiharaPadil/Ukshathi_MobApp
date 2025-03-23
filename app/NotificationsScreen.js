//NotificationScreen.js 
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Background from '.././components_ad/Background';
import NotificationButton from '../components_ad/NotificationItem'; // Renamed import

export default function NotificationsScreen() {
  const router = useRouter();

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "System Update Available",
      message: "New firmware version 2.3.1 is ready for installation",
      timestamp: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      title: "Watering Completed",
      message: "Quadra system finished scheduled watering cycle",
      timestamp: "5 hours ago",
      unread: false
    },
    {
      id: 3,
      title: "Low Battery Alert",
      message: "Device Uno battery level at 15% - please recharge",
      timestamp: "1 day ago",
      unread: true
    },
  ];

  const markAllAsRead = () => {
    // Implement your mark all as read logic
  };

  return (
    <Background>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
        <Pressable onPress={markAllAsRead} style={styles.markAllButton}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </Pressable>
      </View>

      {notifications.map((notification) => (
        <Pressable 
          key={notification.id}
          style={[styles.notificationCard, notification.unread && styles.unreadCard]}
          onPress={() => router.push(`/notification-details/${notification.id}`)}
        >
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            {notification.unread && <View style={styles.unreadBadge} />}
          </View>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          <Text style={styles.timestamp}>{notification.timestamp}</Text>
        </Pressable>
      ))}

      {/* Add the button at the bottom */}
      <NotificationButton 
        title="Enable Notifications"
        style={{ marginTop: 20 }}
      />
      
    </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D5A3D',
    fontFamily: 'Montserrat',
    left: 50
  },
  markAllButton: {
    backgroundColor: '#71BC78',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  markAllText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Montserrat',
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#71BC78',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D5A3D',
    fontFamily: 'Montserrat',
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#71BC78',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Montserrat',
  },
});

