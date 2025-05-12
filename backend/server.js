//server.js

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();
const path = require('path'); // Add this line
// const { Expo } = require('expo-server-sdk');

const app = express();
app.use(cors({
  origin: '*', // Or '*' for development
  methods: ['GET', 'POST', 'PUT']
}));
app.use(express.json());

// MySQL Connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test Database Connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
    connection.release();
  }
});

// Export the database connection for use in other files
module.exports = db;

// Import modularized route files
const LoginSignup = require("./API/LoginSignup");
const Devices = require("./API/ControllerNodeValve");
const History = require("./API/History");
const Schedule = require("./API/Schedule");
const BatteryFlowmeter = require("./API/BatteryFlowmeter");
const TapValve = require("./API/TapValve");
const LiveTap = require("./API/LiveTap");
const Queries = require("./API/Queries");
const Notifications = require("./API/Notifications");

// Use the routes
app.use("/auth", LoginSignup);
app.use("/device", Devices);
app.use("/history", History);
app.use("/schedule", Schedule);
app.use("/realtime", BatteryFlowmeter);
app.use("/tap", TapValve);
app.use("/live", LiveTap);
app.use("/queries", Queries);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/noti", Notifications);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});


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
//         if (!Expo.isExpoPushToken(notif.expo_token)) {
//           console.error(`❌ Invalid token for user ${notif.userID}`);
//           continue;
//         }

//         await expo.sendPushNotificationsAsync([{
//           to: notif.expo_token,
//           sound: 'default',
//           title: '🌧️ Watering Time!',
//           body: 'Your plants will be watered soon!',
//           data: { showInApp: true },
//           _displayInForeground: true

//         }]);

//         db.query(
//           `UPDATE scheduled_notifications 
//            SET notify_time = DATE_ADD(notify_time, INTERVAL 1 DAY)
//            WHERE id = ?`,
//           [notif.id],
//           (err) => {
//             if (err) {
//               console.error(`❌ Failed to reschedule notification ${notif.id}:`, err);
//             } else {
//               // Corrected line below
//               console.log(`♻️ Rescheduled notification for user ${notif.userID} to ${new Date(new Date(notif.notify_time).getTime() + 86400000)}`);
//             }
//           }
//         );
//       } catch (error) {
//         console.error(`❌ Failed to send notification:`, error);
//       }
//     }
//   });
// }

// checkNotifications();
// setInterval(checkNotifications, 60000);
// console.log('🔔 Notification worker started');







