// // //notificationWorker.js
// // const db = require("./server");
// // const { Expo } = require('expo-server-sdk');
// // const expo = new Expo();

// // async function checkNotifications() {
// //   try {
// //     // Get due notifications
// //     const [notifications] = await db.query(`
// //       SELECT n.*, u.expo_token 
// //       FROM scheduled_notifications n
// //       JOIN userLogin u ON n.userID = u.userID
// //       WHERE n.notify_time <= NOW()
// //     `);
    
// //     // Send each notification
// //     for (const notif of notifications) {
// //       try {
// //         await expo.sendPushNotificationsAsync([{
// //           to: notif.expo_token,
// //           sound: 'default',
// //           title: '🌧️ Watering Time!',
// //           body: 'Your plants will be watered in 5 minutes!'
// //         }]);
        
// //         // Delete sent notification
// //         await db.query(
// //           'DELETE FROM scheduled_notifications WHERE id = ?',
// //           [notif.id]
// //         );
// //       } catch (error) {
// //         console.error(`Failed to notify user ${notif.userID}:`, error);
// //       }
// //     }
// //   } catch (error) {
// //     console.error('Notification worker error:', error);
// //   }
// // }

// // // Check every minute
// // setInterval(checkNotifications, 60000);



// const mysql = require('mysql2');
// require('dotenv').config();
// const { Expo } = require('expo-server-sdk');

// // Database connection (same as your server.js)
// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Test database connection
// db.getConnection((err, connection) => {
//   if (err) {
//     console.error('❌ Database connection failed:', err);
//     process.exit(1);
//   }
//   console.log('✅ Connected to database');
//   connection.release();
// });

// const expo = new Expo();

// function checkNotifications() {
//   console.log('🕒 Checking for notifications...');
  
//   db.query(`
//     SELECT n.*, u.expo_token 
//     FROM scheduled_notifications n
//     JOIN userLogin u ON n.userID = u.userID
//     WHERE n.notify_time <= NOW()
//   `, async (err, notifications) => {
//     if (err) {
//       console.error('❌ Notification query error:', err);
//       return;
//     }

//     if (notifications.length === 0) {
//       console.log('⏳ No notifications to send');
//       return;
//     }

//     console.log(`📨 Found ${notifications.length} notifications to send`);

//     for (const notif of notifications) {
//       try {
//         // Validate token
//         if (!Expo.isExpoPushToken(notif.expo_token)) {
//           console.error(`❌ Invalid token for user ${notif.userID}`);
//           continue;
//         }

//         // Send notification
//         await expo.sendPushNotificationsAsync([{
//           to: notif.expo_token,
//           sound: 'default',
//           title: '🌧️ Watering Time!',
//           body: 'Your plants will be watered soon!'
//         }]);

//         // Delete sent notification
//         db.query(
//           'DELETE FROM scheduled_notifications WHERE id = ?',
//           [notif.id],
//           (err) => {
//             if (err) {
//               console.error(`❌ Failed to delete notification ${notif.id}:`, err);
//             } else {
//               console.log(`✅ Sent notification to user ${notif.userID}`);
//             }
//           }
//         );
//       } catch (error) {
//         console.error(`❌ Failed to send notification:`, error);
//       }
//     }
//   });
// }

// // Run immediately and every minute
// checkNotifications();
// setInterval(checkNotifications, 60000);

// console.log('🔔 Notification worker started');


const mysql = require('mysql2');
require('dotenv').config();
const { Expo } = require('expo-server-sdk');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const expo = new Expo();

function checkNotifications() {
  console.log('🕒 Checking for notifications...');
  
  db.query(`
    SELECT n.*, u.expo_token 
    FROM scheduled_notifications n
    JOIN userLogin u ON n.userID = u.userID
    WHERE n.notify_time <= NOW()
  `, async (err, notifications) => {
    if (err) {
      console.error('❌ Notification query error:', err);
      return;
    }

    if (notifications.length === 0) {
      console.log('⏳ No notifications to send');
      return;
    }

    console.log(`📨 Found ${notifications.length} notifications to send`);

    for (const notif of notifications) {
      try {
        if (!Expo.isExpoPushToken(notif.expo_token)) {
          console.error(`❌ Invalid token for user ${notif.userID}`);
          continue;
        }

        await expo.sendPushNotificationsAsync([{
          to: notif.expo_token,
          sound: 'default',
          title: '🌧️ Watering Time!',
          body: 'Your plants will be watered soon!'
        }]);

        db.query(
          `UPDATE scheduled_notifications 
           SET notify_time = DATE_ADD(notify_time, INTERVAL 1 DAY)
           WHERE id = ?`,
          [notif.id],
          (err) => {
            if (err) {
              console.error(`❌ Failed to reschedule notification ${notif.id}:`, err);
            } else {
              // Corrected line below
              console.log(`♻️ Rescheduled notification for user ${notif.userID} to ${new Date(new Date(notif.notify_time).getTime() + 86400000)}`);
            }
          }
        );
      } catch (error) {
        console.error(`❌ Failed to send notification:`, error);
      }
    }
  });
}

checkNotifications();
setInterval(checkNotifications, 60000);
console.log('🔔 Notification worker started');