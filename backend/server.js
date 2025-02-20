//serve.js

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors({origin: '*' }));
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
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL Database');
    connection.release();
  }
});



//Signin API
const { v4: uuidv4 } = require("uuid");

pepper = process.env.PEPPER;

app.post("/signup", async (req, res) => {
  let { firstName, lastName, email, password, phoneNumber, address, city, state, controllers } = req.body;

  // Validate required fields
  if (!firstName || !email || !password) {
    return res.status(400).json({ message: "First name, email, and password are required." });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password + pepper, 10);

    // Insert into userLogin
    const loginSql = "INSERT INTO userLogin (userEmail, passwordHash) VALUES (?, ?)";
    db.query(loginSql, [email, hashedPassword], (err, loginResult) => {
      if (err) {
        console.error("Database Error (userLogin):", err);
        return res.status(500).json({ message: "Error creating user." });
      }

      const userId = loginResult.insertId;

      // Insert into userData
      const userDataSql = `
        INSERT INTO userData 
          (userID, firstName, lastName, phoneNumber, userEmail, address, city, state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const userDataValues = [
        userId, firstName, lastName || null, phoneNumber || null, 
        email, address || null, city || null, state || null
      ];

      db.query(userDataSql, userDataValues, async (err) => {
        if (err) {
          console.error("Database Error (userData):", err);
          return res.status(500).json({ message: "Error saving user details." });
        }

        // Insert Controllers, Nodes, and Valves
        if (controllers && controllers.length > 0) {
          try {
            for (const controller of controllers) {
              const controllerId = uuidv4(); // Generate UUID for controllerID
              const controllerSql = `
                INSERT INTO controller 
                  (controllerID, controllerName, userID, deviceType)
                VALUES (?, ?, ?, ?)
              `;
              await db.promise().query(controllerSql, [
                controllerId, 
                controller.name, 
                userId, 
                controller.deviceType
              ]);

              // Insert Nodes
              for (const node of controller.nodes) {
                const nodeId = uuidv4(); // Generate UUID for nodeID
                const nodeSql = `
                  INSERT INTO node 
                    (nodeID, nodeName, controllerID)
                  VALUES (?, ?, ?)
                `;
                await db.promise().query(nodeSql, [nodeId, node.name, controllerId]);

                // Insert Valves
                for (const valve of node.valves) {
                  const valveId = uuidv4(); // Generate UUID for valveID
                  const valveSql = `
                    INSERT INTO valve 
                      (valveID, valveName, nodeID, controllerID, userID)
                    VALUES (?, ?, ?, ?, ?)
                  `;
                  await db.promise().query(valveSql, [
                    valveId, 
                    valve.name, 
                    nodeId, 
                    controllerId, 
                    userId
                  ]);
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

  // app.post("/signup", async (req, res) => {
  //   let { name, email, password, device_types, controllers } = req.body;

  //   // Validate all fields
  //   if (!name || !email || !password || !device_types || device_types.length === 0) {
  //     return res.status(400).json({ message: "All fields are required." });
  //   }

  //   try {
  //     // Convert to string and trim inputs
  //     name = name.toString().trim();
  //     email = email.toString().trim();
  //     password = password.toString().trim();
  //     device_types = device_types.map((device) => device.toString().trim());

  //     // Hash password with 10 salt rounds
  //     const hashedPassword = await bcrypt.hash(password, 10);

  //     // Insert user data into users table
  //     const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  //     db.query(sql, [name, email, hashedPassword], (err, result) => {
  //       if (err) {
  //         console.error("Database Insert Error:", err);
  //         return res.status(500).json({ message: "Database error." });
  //       }

  //       // After user creation, insert device types into user_products table
  //       const userId = result.insertId; // Get the newly created user_id

  //       // Prepare device type insertions
  //       const deviceInsertQueries = device_types.map((device) => {
  //         return new Promise((resolve, reject) => {
  //           const deviceSql = "INSERT INTO user_products (user_id, product_name) VALUES (?, ?)";
  //           db.query(deviceSql, [userId, device], (err, deviceResult) => {
  //             if (err) {
  //               console.error("Device Insert Error:", err);
  //               reject(err);
  //             } else {
  //               resolve(deviceResult);
  //             }
  //           });
  //         });
  //       });

  //       // Wait for all device types to be inserted
  //       Promise.all(deviceInsertQueries)
  //         .then(() => {
  //           res.status(201).json({ message: "User created successfully." });
  //         })
  //         .catch(() => {
  //           res.status(500).json({ message: "Error saving device types." });
  //         });
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });


 //Login API 

app.post('/login', async (req, res) => {
  let { userEmail, passwordHash } = req.body;

  if (!userEmail || !passwordHash) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  userEmail = userEmail.toString().trim();
  passwordHash = passwordHash.toString().trim();
  pepper=process.env.PEPPER;

  console.log('Login attempt for:', userEmail);

  try {
    const query = 'SELECT * FROM userLogin WHERE userEmail = ?';
    const [results] = await db.promise().query(query, [userEmail]);

    if (results.length === 0) {
      console.log('User not found:', userEmail);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(passwordHash + pepper, user.passwordHash);

    if (isMatch) {
      console.log('Login successful for:', userEmail);
      return res.json({
        success: true,
        message: 'Login successful',
        userID: user.userID,
        email: user.userEmail,
      });
    } else {
      console.log('Invalid password for:', userEmail);
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


//landing api -update to new db api
app.get('/controller/:id', (req, res) => {
  const id = req.params.id;
  const query = `
      SELECT c.deviceType
      FROM controller c
      WHERE c.userID = ?;
  `;
  
  db.query(query, [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      // Map the correct column 'deviceType'
      res.json(results.map(row => row.deviceType));  
      console.log(results);
  });
});




//quadra_nodes screen api- changed to maam new db
app.get('/nodes', (req, res) => {
  const { userID } = req.query;
  
  if (!userID) {
      return res.status(400).json({ message: 'userID is required' });
  }

  const query = `
        SELECT N.*
        FROM Node N
        JOIN Controller C ON N.controllerID = C.controllerID
        WHERE C.userID = ?;
    `;

  db.query(query, [userID], (err, results) => {
      if (err) {
          console.error('Database error:', err);  // Add detailed logging
          return res.status(500).json({ message: 'Database error', error: err });
      }
      
      if (results.length === 0) {
          return res.status(404).json({ message: 'No nodes found for this userID' });
      }

      console.log('Query results:', results);
      res.json(results);
  });
});


//screen2-api of valves screen updated to maam ka db
app.get('/nodes/:node_id/valves', (req, res) => {
  const node_id = req.params.node_id; // Keep node_id as a string

  if (!node_id) {
      return res.status(400).json({ message: 'Invalid node_id' });
  }

  const query = 'SELECT * FROM valve WHERE nodeID = ?'; // Use correct table name

  db.query(query, [node_id], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error', error: err });
      }

      console.log(`Fetched Valves for node_id ${node_id}:`, results);

      if (results.length === 0) {
          return res.status(404).json({ message: 'No valves found for this node_id' });
      }
       console.log(results)

      res.json(results);
  });
});

//storig scheduling
app.post('/save-schedule', (req, res) => {
  const { node_id, valve_name, duration } = req.body;

  const query = `INSERT INTO history (node_id, valve_name, duration) VALUES (?, ?, ?)`;
  db.query(query, [node_id, valve_name, duration], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error saving data');
    }
    res.send({ message: 'Schedule saved', id: result.insertId });
  });
});

// Fetch Latest Watering Schedule
app.get('/get-schedule', (req, res) => {
  const { node_id, valve_name } = req.query;

  const query = `SELECT duration, timestamp FROM history WHERE node_id = ? AND valve_name = ? ORDER BY timestamp DESC LIMIT 1`;
  db.query(query, [node_id, valve_name], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching data');
    }
    res.json(results[0]); // Return latest schedule
  });
});


//{
//not yet implemneted: 

// Fetch flow meter data for a node
// app.get('/nodes/:node_id/flowmeters', (req, res) => {
//     const { node_id } = req.params;
//     const query = 'SELECT * FROM FlowMeters WHERE node_id = ? ORDER BY timestamp DESC';
//     db.query(query, [node_id], (err, results) => {
//         if (err) {
//             return res.status(500).json({ message: 'Database error', error: err });
//         }
//         res.json(results);
//     });
// });

// Fetch battery voltage data for a node
// app.get('/nodes/:node_id/battery', (req, res) => {
//     const { node_id } = req.params;
//     const query = 'SELECT * FROM BatteryVoltage WHERE node_id = ? ORDER BY timestamp DESC';
//     db.query(query, [node_id], (err, results) => {
//         if (err) {
//             return res.status(500).json({ message: 'Database error', error: err });
//         }
//         res.json(results);
//     });
// });
//}

// Start Server
  const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {  // ✅ Bind to 0.0.0.0
    console.log(`Server running on port ${PORT}`);

});
