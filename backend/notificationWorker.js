// //notificationWorker.js
// const db = require("./server");
// const { Expo } = require('expo-server-sdk');
// const expo = new Expo();

// async function checkNotifications() {
//   try {
//     // Get due notifications
//     const [notifications] = await db.query(`
//       SELECT n.*, u.expo_token 
//       FROM scheduled_notifications n
//       JOIN userLogin u ON n.userID = u.userID
//       WHERE n.notify_time <= NOW()
//     `);
    
//     // Send each notification
//     for (const notif of notifications) {
//       try {
//         await expo.sendPushNotificationsAsync([{
//           to: notif.expo_token,
//           sound: 'default',
//           title: '🌧️ Watering Time!',
//           body: 'Your plants will be watered in 5 minutes!'
//         }]);
        
//         // Delete sent notification
//         await db.query(
//           'DELETE FROM scheduled_notifications WHERE id = ?',
//           [notif.id]
//         );
//       } catch (error) {
//         console.error(`Failed to notify user ${notif.userID}:`, error);
//       }
//     }
//   } catch (error) {
//     console.error('Notification worker error:', error);
//   }
// }

// // Check every minute
// setInterval(checkNotifications, 60000);



const mysql = require("mysql2");
require("dotenv").config();
const { Expo } = require('expo-server-sdk');

// Database Connection (same config as server.js)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Notification Worker
function checkNotifications() {
  db.query(`
    SELECT n.*, u.expo_token 
    FROM scheduled_notifications n
    JOIN userLogin u ON n.userID = u.userID
    WHERE n.notify_time <= NOW()
  `, (err, notifications) => {
    if (err) return console.error('Notification error:', err);

    const expo = new Expo();
    
    notifications.forEach(notif => {
      if (!Expo.isExpoPushToken(notif.expo_token)) {
        return console.error('Invalid token for user:', notif.userID);
      }

      expo.sendPushNotificationsAsync([{
        to: notif.expo_token,
        sound: 'default',
        title: '🌧️ Watering Time!',
        body: 'Your plants will be watered in 5 minutes!'
      }]).then(() => {
        db.query(
          'DELETE FROM scheduled_notifications WHERE id = ?',
          [notif.id],
          (err) => {
            if (err) console.error('Delete error:', err);
            else console.log('Notification sent to:', notif.userID);
          }
        );
      }).catch(error => {
        console.error('Send failed:', error);
      });
    });
  });
}

// Run every minute
setInterval(checkNotifications, 60000);
console.log('Notification worker started');