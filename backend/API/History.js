const express = require("express");
const router = express.Router();
const db = require("../server"); 

// Get History by Valve ID
router.get('/get-history/:valveID', (req, res) => {
  const { valveID } = req.params;

  if (!valveID) {
    return res.status(400).json({ error: 'valveID is required' });
  }

  const query = `SELECT * FROM history WHERE valveID = ?`;

  db.query(query, [valveID], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'No history' });
      }

      res.json(results);
  });
});

module.exports = router;