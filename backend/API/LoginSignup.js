const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("../server"); // Import the database connection from serve.js

const PEPPER = process.env.PEPPER;

// Helper function to hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password + PEPPER, 10);
};

// Signup API
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, address, city, state, controllers } = req.body;

  if (!firstName || !email || !password) {
    return res.status(400).json({ message: "First name, email, and password are required." });
  }

  try {
    const hashedPassword = await hashPassword(password);

    const loginSql = "INSERT INTO userLogin (userEmail, passwordHash) VALUES (?, ?)";
    db.query(loginSql, [email, hashedPassword], (err, loginResult) => {
      if (err) {
        console.error("Database Error (userLogin):", err);
        return res.status(500).json({ message: "Error creating user." });
      }

      const userId = loginResult.insertId;

      const userDataSql = `
        INSERT INTO userData 
          (userID, firstName, lastName, phoneNumber, userEmail, address, city, state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const userDataValues = [userId, firstName, lastName || null, phoneNumber || null, email, address || null, city || null, state || null];

      db.query(userDataSql, userDataValues, async (err) => {
        if (err) {
          console.error("Database Error (userData):", err);
          return res.status(500).json({ message: "Error saving user details." });
        }

        if (controllers && controllers.length > 0) {
          try {
            for (const controller of controllers) {
              const controllerId = uuidv4();
              const controllerSql = `
                INSERT INTO controller 
                  (controllerID, controllerName, userID, deviceType)
                VALUES (?, ?, ?, ?)
              `;
              await db.promise().query(controllerSql, [controllerId, controller.name, userId, controller.deviceType]);

              for (const node of controller.nodes) {
                const nodeId = uuidv4();
                const nodeSql = `
                  INSERT INTO node 
                    (nodeID, nodeName, controllerID)
                  VALUES (?, ?, ?)
                `;
                await db.promise().query(nodeSql, [nodeId, node.name, controllerId]);

                for (const valve of node.valves) {
                  const valveId = uuidv4();
                  const valveSql = `
                    INSERT INTO valve 
                      (valveID, valveName, nodeID, controllerID, userID)
                    VALUES (?, ?, ?, ?, ?)
                  `;
                  await db.promise().query(valveSql, [valveId, valve.name, nodeId, controllerId, userId]);
                }
              }
            }
            res.status(201).json({ message: "User and devices registered successfully." });
          } catch (error) {
            console.error("Device Registration Error:", error);
            res.status(500).json({ message: "Error saving devices." });
          }
        } else {
          res.status(201).json({ message: "User registered successfully." });
        }
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

router.post('/login', async (req, res) => {
  let { userEmail, passwordHash, expoToken } = req.body;

  if (!userEmail || !passwordHash) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  userEmail = userEmail.toString().trim();
  passwordHash = passwordHash.toString().trim();
  const pepper = process.env.PEPPER;

  try {
    const query = 'SELECT * FROM userLogin WHERE userEmail = ?';
    const [results] = await db.promise().query(query, [userEmail]);

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(passwordHash + pepper, user.passwordHash);

    if (isMatch) {
      // Step 1: Update the user's push token if provided
      if (expoToken) {
        await db.promise().query(`
          UPDATE userLogin
          SET expo_token = ?
          WHERE userID = ?
        `, [expoToken, user.userID]);
      }

      // Step 2: Return success response
      return res.json({
        success: true,
        message: 'Login successful',
        userID: user.userID,
        email: user.userEmail,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;