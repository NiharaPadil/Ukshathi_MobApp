
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator'); // Import express-validator
const db = require("../server"); // Your database connection
const { Expo } = require('expo-server-sdk');
const expo = new Expo(); // Create a new Expo SDK client

router.post('/register-device', [
    body('userId').isInt().withMessage('User ID must be an integer'),
    body('token').isString().notEmpty().withMessage('Token is required'),
    body('deviceId').isString().notEmpty().withMessage('Device ID is required')
], (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    const { userId, token, deviceId } = req.body;

    // 1. Check for existing registration
    db.query(
        `SELECT * FROM android 
         WHERE idandroid = ? AND androidDeviceID = ? 
         ORDER BY registeredDate DESC LIMIT 1`,
        [userId, deviceId],
        (checkError, existing) => {
            if (checkError) {
                console.error('Database check error:', checkError);
                return res.status(500).json({
                    success: false,
                    error: 'Database operation failed'
                });
            }

            // If exists with same token, return success
            if (existing.length > 0 && existing[0].androidToken === token) {
                return res.json({ 
                    success: true,
                    message: 'Device already registered',
                    device: existing[0]
                });
            }

            // 2. Insert new registration
            db.query(
                `INSERT INTO android (idandroid, androidToken, androidDeviceID)
                 VALUES (?, ?, ?)`,
                [userId, token, deviceId],
                (insertError, result) => {
                    if (insertError) {
                        console.error('Database insert error:', insertError);
                        return res.status(500).json({
                            success: false,
                            error: 'Device registration failed'
                        });
                    }

                    if (result.affectedRows === 1) {
                        // 3. Get the newly created record
                        db.query(
                            `SELECT * FROM android 
                             WHERE idandroid = ? AND androidDeviceID = ?
                             ORDER BY registeredDate DESC LIMIT 1`,
                            [userId, deviceId],
                            (selectError, newDevice) => {
                                if (selectError) {
                                    console.error('Database select error:', selectError);
                                    return res.status(500).json({
                                        success: false,
                                        error: 'Failed to fetch registered device'
                                    });
                                }

                                return res.status(201).json({
                                    success: true,
                                    message: 'Device registered successfully',
                                    device: newDevice[0]
                                });
                            }
                        );
                    } else {
                        return res.status(500).json({
                            success: false,
                            error: 'Database insert failed'
                        });
                    }
                }
            );
        }
    );
});




router.post('/save-notification', (req, res) => {
    const { message, userId } = req.body;

    // First validate inputs
    if (!message || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Both message and userId are required'
        });
    }

    db.query(
        `INSERT INTO Notificationsandalerts 
         (idNotificationsandalerts, Message, Acknowledgementstatus, Closestatus)
         VALUES (?, ?, 'Unread', 'Open')`,
        [userId, message],
        (error, result) => {
            if (error) {
                console.error('❌ Save notification error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Database error saving notification'
                });
            }

            // After saving, fetch the newly created notification
            db.query(
                `SELECT * FROM Notificationsandalerts WHERE eventid = ?`,
                [result.insertId],
                (fetchError, notification) => {
                    if (fetchError || !notification.length) {
                        console.error('❌ Fetch new notification error:', fetchError);
                        return res.json({
                            success: true,
                            message: 'Notification saved but could not fetch details',
                            notificationId: result.insertId
                        });
                    }

                    res.json({
                        success: true,
                        message: 'Notification saved successfully',
                        notification: notification[0]
                    });
                }
            );
        }
    );
});




router.get('/get-latest-notification/:userId', (req, res) => {
    const userId = req.params.userId;

    // First validate userId
    if (!userId || isNaN(userId)) {
        return res.status(400).json({
            success: false,
            message: 'Valid userId is required'
        });
    }

    db.query(
        `SELECT * FROM Notificationsandalerts 
         WHERE idNotificationsandalerts = ?
         ORDER BY Messagetime DESC LIMIT 1`,
        [userId],
        (error, results) => {
            if (error) {
                console.error('❌ Fetch notification error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Database error fetching notification'
                });
            }

            if (results.length === 0) {
                return res.json({
                    success: true,
                    message: 'No notifications found for this user'
                });
            }

            // If found, update the status to "Read"
            db.query(
                `UPDATE Notificationsandalerts 
                 SET Acknowledgementstatus = 'Read', 
                     Acknowledgetime = NOW() 
                 WHERE eventid = ?`,
                [results[0].eventid],
                (updateError) => {
                    if (updateError) {
                        console.error('⚠️ Could not update status:', updateError);
                        // Still return the notification even if status update fails
                        return res.json({
                            success: true,
                            notification: results[0],
                            message: 'Notification fetched (status not updated)'
                        });
                    }

                    // Return with updated status
                    res.json({
                        success: true,
                        notification: {
                            ...results[0],
                            Acknowledgementstatus: 'Read',
                            Acknowledgetime: new Date().toISOString()
                        },
                        message: 'Notification fetched and marked as read'
                    });
                }
            );
        }
    );
});


router.post('/send-push/:userId', (req, res) => {
    const { userId } = req.params;
    const { message } = req.body;

    if (!userId || isNaN(userId) || !message) {
        return res.status(400).json({
            success: false,
            message: 'Valid userId and message are required'
        });
    }

    db.query(
        `SELECT * FROM android WHERE idandroid = ?`,
        [userId],
        async (error, results) => {
            if (error) {
                console.error('❌ Fetch device token error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Database error fetching device token'
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No device registered for this user'
                });
            }

            const token = results[0].androidToken;

            if (!Expo.isExpoPushToken(token)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Expo push token'
                });
            }

            const messages = [{
                to: token,
                sound: 'default',
                body: message,
                data: { userId }
            }];

            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(messages);
                return res.json({
                    success: true,
                    message: 'Push notification sent successfully',
                    ticket: ticketChunk
                });
            } catch (err) {
                console.error('❌ Error sending push notification:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error sending push notification'
                });
            }
        }
    );
});

module.exports = router;