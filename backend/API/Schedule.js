const express = require("express");
const router = express.Router();
const db = require("../server"); 

// Set Watering Duration
router.post("/set-duration", (req, res) => {
  const { valveID, duration } = req.body;

  if (!valveID || !duration) {
      return res.status(400).json({ error: "Missing valveID or duration" });
  }

  const sql = `
      INSERT INTO schedule (valveID, duration) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE duration = VALUES(duration)
  `;

  db.query(sql, [valveID, duration], (err, result) => {
      if (err) {
          console.error("Error inserting/updating duration:", err);
          return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Duration set successfully", duration });
  });
});

// Get Watering Duration
router.get('/get-duration/:valveID', async (req, res) => {
  try {
    const { valveID } = req.params;

    if (!valveID) {
      return res.status(400).json({ error: 'valveID is required' });
    }

    const query = `SELECT duration FROM schedule WHERE valveID = ?`;
    db.query(query, [valveID], (error, results) => {
      if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ error: 'Database query failed' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'No duration found for this valve' });
      }

      res.json({ duration: results[0].duration });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;