// import { View, Button } from 'react-native'; // Add View here
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';
// import React from 'react';

// const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

// export default function NotificationButton({ 
//   title = "Enable Notifications",
//   onSuccess,
//   onError,
//   style 
// }) {
//   // Replace with actual user object
//   const currentUser = { userID: 1};

//   const handleNotificationRegistration = async () => {
//     try {
//       // Step 1: Request permissions
//       const { status } = await Notifications.requestPermissionsAsync();
//       if (status !== 'granted') {
//         if (onError) onError('Permission denied');
//         return;
//       }
  
//       // Step 2: Get push token
//       const token = (await Notifications.getExpoPushTokenAsync({
//         projectId: Constants.expoConfig.extra.eas.projectId
//       })).data;
      
//       // Step 3: Send to backend
//       const response = await fetch(`${API_BASE_URL}/notifications/store-token`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           userId: currentUser.userID,
//           token: token
//         }),
//       });
  
//       // Log the response
//       console.log('Response status:', response.status);
//       const responseData = await response.json();
//       console.log('Response data:', responseData);
  
//       if (!response.ok) throw new Error('Failed to store token');
      
//       if (onSuccess) onSuccess(token);
//     } catch (error) {
//       console.error('Notification error:', error);
//       if (onError) onError(error.message);
//     }
//   };

//   const sendTestNotification = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/notifications/send-test`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           userId: currentUser.userID,
//         }),
//       });
  
//       if (!response.ok) throw new Error('Failed to send');
//       alert('Notification sent!');
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Failed to send notification');
//     }
//   };

//   return (
//     <View>
//       <Button
//         title={title}
//         onPress={handleNotificationRegistration}
//         style={style}
//       />
//       <Button
//         title="Send Test Notification"
//         onPress={sendTestNotification}
//         style={{ marginTop: 20 }}
//       />
//     </View>
//   );
// };