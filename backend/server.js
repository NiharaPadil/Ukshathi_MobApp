//server.js

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();
const path = require('path'); // Add this line

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
app.use("/notifications", Notifications);


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







