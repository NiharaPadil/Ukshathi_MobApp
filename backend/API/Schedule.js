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


// Set Schedule Watering Time 
router.post('/set-schedule', (req, res) => {
  const { valveID, startDate, duration, time, scheduleChange, onoff, weather } = req.body;

  const query = `
    INSERT INTO schedule (valveID, startDate, duration, time, scheduleChange, onoff, weather)
    VALUES (?, ?, ?, ?, ?, ?, ?) AS new
    ON DUPLICATE KEY UPDATE 
      startDate = new.startDate,
      duration = new.duration,
      time = new.time,
      scheduleChange = new.scheduleChange,
      onoff = new.onoff,
      weather = new.weather
  `;

  db.query(query, [valveID, startDate, duration, time, scheduleChange, onoff, weather], (err, result) => {
    if (err) {
      console.error('Error inserting/updating schedule:', err);
      res.status(500).json({ message: 'Database error' });
    } else {
      res.json({ message: 'Schedule saved successfully' });
    }
  });
});

// Get Schedule Watering Time
router.get('/get-schedule/:valveID', (req, res) => {
  const { valveID } = req.params;

  const query = `SELECT * FROM schedule WHERE valveID = ?`;

  db.query(query, [valveID], (err, results) => {
    if (err) {
      console.error('Error fetching schedule:', err);
      res.status(500).json({ message: 'Database error' });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'No schedule found' });
    } else {
      console.log(results[0]);
      res.json(results[0]); // Return the first matching result
    }
  });
});


module.exports = router;