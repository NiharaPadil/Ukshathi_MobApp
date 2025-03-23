const express = require('express');
const router = express.Router();
const { Expo } = require('expo-server-sdk');
const db = require("../server"); // Import the database connection from serve.js


// routes/notifications.js
router.post('/store-token', async (req, res) => {
  try {
    const { userId, token } = req.body;

    // Log incoming request
    console.log('Received request:', { userId, token });

    // Validate token
    if (!Expo.isExpoPushToken(token)) {
      console.error('Invalid token:', token);
      return res.status(400).json({ error: "Invalid token" });
    }

    // Execute query with callback
    db.query(`
      INSERT INTO user_tokens (user_id, expo_token)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE expo_token = VALUES(expo_token)
    `, [userId, token], (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: "Database error", details: error.message });
      }

      console.log('Query result:', results);
      res.json({ success: true });
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: "Unexpected error", details: error.message });
  }
});


router.post('/send-test', (req, res) => {
  const { userId } = req.body;
  const expo = new Expo();

  // Step 1: Get user's token
  db.query(`
    SELECT expo_token 
    FROM user_tokens
    WHERE user_id = ?
  `, [userId], (error, tokens) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: "Database error", details: error.message });
    }

    // Step 2: Validate tokens
    const validTokens = tokens
      .map(t => t.expo_token)
      .filter(token => Expo.isExpoPushToken(token));

    if (validTokens.length === 0) {
      return res.status(400).json({ error: "No valid tokens found" });
    }

    // Step 3: Prepare messages
    const messages = validTokens.map(token => ({
      to: token,
      sound: 'default',
      title: 'Test Notification',
      body: 'This is a test! 🎉',
    }));

    // Step 4: Send notifications
    const chunks = expo.chunkPushNotifications(messages);
    chunks.forEach(chunk => {
      expo.sendPushNotificationsAsync(chunk)
        .then(receipts => {
          console.log('Notification receipts:', receipts);
        })
        .catch(error => {
          console.error('Notification error:', error);
        });
    });

    res.json({ success: true, sent: validTokens.length });
    console.log('Test notification sent to:', validTokens);
  });
});

module.exports = router;