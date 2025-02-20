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



//lima signinn api
  app.post("/signup", async (req, res) => {
    let { name, email, password, device_types } = req.body;

    // Validate all fields
    if (!name || !email || !password || !device_types || device_types.length === 0) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      // Convert to string and trim inputs
      name = name.toString().trim();
      email = email.toString().trim();
      password = password.toString().trim();
      device_types = device_types.map((device) => device.toString().trim());

      // Hash password with 10 salt rounds
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user data into users table
      const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Database Insert Error:", err);
          return res.status(500).json({ message: "Database error." });
        }

        // After user creation, insert device types into user_products table
        const userId = result.insertId; // Get the newly created user_id

        // Prepare device type insertions
        const deviceInsertQueries = device_types.map((device) => {
          return new Promise((resolve, reject) => {
            const deviceSql = "INSERT INTO user_products (user_id, product_name) VALUES (?, ?)";
            db.query(deviceSql, [userId, device], (err, deviceResult) => {
              if (err) {
                console.error("Device Insert Error:", err);
                reject(err);
              } else {
                resolve(deviceResult);
              }
            });
          });
        });

        // Wait for all device types to be inserted
        Promise.all(deviceInsertQueries)
          .then(() => {
            res.status(201).json({ message: "User created successfully." });
          })
          .catch(() => {
            res.status(500).json({ message: "Error saving device types." });
          });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });


//Login API changed(lima)

  app.post('/login', (req, res) => {
    let { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Trim inputs to avoid accidental spaces
    name = name.toString().trim();
    password = password.toString().trim();

    console.log('Received Username:', name);
    console.log('Received Password:', password);

    const query = 'SELECT * FROM users WHERE name = ?';
    db.query(query, [name], async (err, results) => {
      if (err) {
        console.error('Database error:', err); //debugg
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length === 0) {
        console.log('User not found.');
        return res.status(404).json({ message: 'User not found' });
      }

      const user = results[0];
      console.log('Database Result:', user); //debugg
      console.log('User ID from DB:', user.user_id); //debugg


      try {
        const isMatch = await bcrypt.compare(password, user.password); // Compare the hashed password
        console.log('Password Match Result:', isMatch);

        if (isMatch) {
          console.log('Sending Response:', {
            message: 'Login successful',
            user_id: user.user_id  // to return user_idd
          });
          return res.json({ message: 'Login successful', user_id: user.user_id , name: user.name});

        } else {
          return res.status(400).json({ message: 'Invalid password' });
        }
      } catch (compareError) {
        console.error('Password comparison error:', compareError);
        return res.status(500).json({ message: 'Error comparing passwords' });
      }
    });
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

      // console.log('Query results:', results);
      res.json(results);
  });
});

// Fetch valves based on node ID
// app.get('/nodes/:node_id/valves', (req, res) => {
//     const { node_id } = req.params;
//     const query = 'SELECT * FROM Valves WHERE node_id = ?';
//     db.query(query, [node_id], (err, results) => {
//         if (err) {
//             return res.status(500).json({ message: 'Database error', error: err });
//         }
//         res.json(results);
//     });
// });

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
