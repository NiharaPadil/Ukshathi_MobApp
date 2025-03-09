const express = require("express");
const router = express.Router();
const db = require("../server"); 

// Battery Voltage API
router.get('/battery/:nodeID', async (req, res) => {
  console.log("Received request for node:", req.params.nodeID);
  const nodeID = req.params.nodeID.trim();
  console.log("Received nodeID:", `'${nodeID}'`); // Debugging

  const query = `
      SELECT batteryVoltage
      FROM node
      WHERE nodeID = ?;
  `;

  db.query(query, [nodeID], (error, results) => {
      if (error) {
          console.error('Error retrieving battery voltage:', error);
          return res.status(500).json({ error: 'Internal server error' });
      }
      console.log("Query Results:", results); // Debugging

      if (results.length === 0) {
          return res.status(404).json({ error: 'No battery voltage found for this node' });
      }

      res.json({ batteryVoltage: results[0].batteryVoltage }); 
  });
});

// Flowmeter API
router.get('/flowmeter/:nodeID', async (req, res) => {
  try {
      console.log("Received request for node:", req.params.nodeID);
      const nodeID = req.params.nodeID.trim();

      if (!nodeID) {
          return res.status(400).json({ error: 'Invalid nodeID' });
      }

      const query = `SELECT flowRate FROM flowmeter WHERE nodeID = ?`;

      db.query(query, [nodeID], (error, results) => {
          if (error) {
              console.error('Database error:', error);
              return res.status(500).json({ error: 'Database query failed' });
          }

          console.log("Query Results:", results);

          if (results.length === 0) {
              return res.status(404).json({ error: 'No flow rate found for this node' });
          }

          res.json({ nodeID, flowRate: results[0].flowRate });
      });

  } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;