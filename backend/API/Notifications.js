// const express = require('express');
// const router = express.Router();
// const { body, validationResult } = require('express-validator'); // Import express-validator
// const db = require("../server"); // Your database connection

// router.post('/register-device', [
//     body('userId').isInt().withMessage('User ID must be an integer'),
//     body('token').isString().notEmpty().withMessage('Token is required'),
//     body('deviceId').isString().notEmpty().withMessage('Device ID is required')
// ], async (req, res) => {
//     // Validate input
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ 
//             success: false,
//             errors: errors.array() 
//         });
//     }

//     const { userId, token, deviceId } = req.body;

//     try {
//         // Check for existing registration
//         const [existing] = await db.execute(
//             `SELECT * FROM android 
//              WHERE idandroid = ? AND androidDeviceID = ? 
//              ORDER BY registeredDate DESC LIMIT 1`,
//             [userId, deviceId]
//         );

//         // If exists with same token, return success
//         if (existing.length > 0 && existing[0].androidToken === token) {
//             return res.json({ 
//                 success: true,
//                 message: 'Device already registered',
//                 device: existing[0]
//             });
//         }

//         // Insert new registration
//         const [result] = await db.execute(
//             `INSERT INTO android (idandroid, androidToken, androidDeviceID)
//              VALUES (?, ?, ?)`,
//             [userId, token, deviceId]
//         );

//         if (result.affectedRows === 1) {
//             const [newDevice] = await db.execute(
//                 `SELECT * FROM android 
//                  WHERE idandroid = ? AND androidDeviceID = ?
//                  ORDER BY registeredDate DESC LIMIT 1`,
//                 [userId, deviceId]
//             );

//             return res.status(201).json({
//                 success: true,
//                 message: 'Device registered successfully',
//                 device: newDevice[0]
//             });
//         }

//         throw new Error('Database insert failed');

//     } catch (error) {
//         console.error('Device registration error:', error);
//         return res.status(500).json({ 
//             success: false,
//             error: 'Device registration failed',
//             details: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator'); // Import express-validator
const db = require("../server"); // Your database connection

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

module.exports = router;