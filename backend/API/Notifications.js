const express = require('express');
const router = express.Router();
const { Expo } = require('expo-server-sdk');
const db = require("../server"); // Import the database connection from serve.js


// // routes/notifications.js
// router.post('/store-token', async (req, res) => {
//   try {
//     const { userId, token } = req.body;

//     // Log incoming request
//     console.log('Received request:', { userId, token });

//     // Validate token
//     if (!Expo.isExpoPushToken(token)) {
//       console.error('Invalid token:', token);
//       return res.status(400).json({ error: "Invalid token" });
//     }

//     // Execute query with callback
//     db.query(`
//       INSERT INTO user_tokens (user_id, expo_token)
//       VALUES (?, ?)
//       ON DUPLICATE KEY UPDATE expo_token = VALUES(expo_token)
//     `, [userId, token], (error, results) => {
//       if (error) {
//         console.error('Database error:', error);
//         return res.status(500).json({ error: "Database error", details: error.message });
//       }

//       console.log('Query result:', results);
//       res.json({ success: true });
//     });
    
//   } catch (error) {
//     console.error('Unexpected error:', error);
//     res.status(500).json({ error: "Unexpected error", details: error.message });
//   }
// });


router.post('/schedule-notification', (req, res) => {
  console.log('\n[START] New schedule notification request');
  console.log('Request body:', req.body);

  const { valveID, wateringTime, userID } = req.body;
  
  if (!valveID || !wateringTime || !userID) {
    console.error('[VALIDATION] Missing parameters:', { valveID, wateringTime, userID });
    return res.status(400).json({
      error: 'valveID, wateringTime, and userID are required',
      code: 'MISSING_PARAMETERS'
    });
  }

  console.log('[PROCESS] Received valid parameters');
  console.log('Current server time:', new Date().toISOString());

  // Convert to UTC and validate time
  const parseAndValidateTime = () => {
    try {
      console.log('[TIME] Raw wateringTime input:', wateringTime);
      
      // Parse as UTC date
      const wateringUTC = new Date(wateringTime);
      if (isNaN(wateringUTC.getTime())) {
        console.error('[TIME] Invalid date format');
        return { error: 'Invalid ISO 8601 date format', code: 'INVALID_DATE' };
      }

      // Create notification time (watering time - 5 minutes UTC)
      const notifyUTC = new Date(wateringUTC);
      notifyUTC.setUTCMinutes(notifyUTC.getUTCMinutes() - 5);
      console.log('[TIME] Calculated notify UTC:', notifyUTC.toISOString());

      // Get current UTC time
      const nowUTC = new Date().toISOString();
      console.log('[TIME] Current UTC time:', nowUTC);

      if (notifyUTC <= new Date(nowUTC)) {
        console.error('[TIME] Notification time in past:', {
          notifyUTC: notifyUTC.toISOString(),
          currentUTC: nowUTC
        });
        return { error: 'Notification time must be in the future', code: 'PAST_NOTIFICATION' };
      }

      return { notifyUTC, wateringUTC };
    } catch (err) {
      console.error('[TIME] Processing error:', err);
      return { error: 'Time processing failed', code: 'TIME_PROCESS_ERROR' };
    }
  };

  // Time validation
  const timeResult = parseAndValidateTime();
  if (timeResult.error) {
    return res.status(400).json(timeResult);
  }
  const { notifyUTC, wateringUTC } = timeResult;

  // Database operations
  db.query(
    'SELECT expo_token FROM userLogin WHERE userID = ?',
    [userID],
    (err, results) => {
      if (err) {
        console.error('[DB] User lookup error:', err);
        return res.status(500).json({ 
          error: 'Database error', 
          code: 'DB_ERROR',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }

      console.log('[DB] User query results:', results);
      
      if (!results[0]?.expo_token) {
        console.error('[DB] No Expo token found for user:', userID);
        return res.status(400).json({ 
          error: 'No notification token registered', 
          code: 'NO_EXPO_TOKEN'
        });
      }

      // Insert/update schedule
      db.query(
        `INSERT INTO scheduled_notifications 
         (userID, valveID, notify_time)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
         notify_time = VALUES(notify_time)`,
        [userID, valveID, notifyUTC],
        (err, result) => {
          if (err) {
            console.error('[DB] Insert error:', err);
            return res.status(500).json({ 
              error: 'Failed to save schedule', 
              code: 'INSERT_ERROR',
              details: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
          }

          console.log('[DB] Insert result:', result);
          console.log(`[SUCCESS] Scheduled ${valveID} for ${notifyUTC.toISOString()}`);

          res.status(200).json({
            success: true,
            valveID,
            notifyTime: notifyUTC.toISOString(),
            wateringTime: wateringUTC.toISOString(),
            message: `Notification scheduled for ${notifyUTC.toISOString()}`
          });
        }
      );
    }
  );
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