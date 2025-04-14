//TapValve.js

const express = require("express");
const router = express.Router();
const db = require("../server"); 

//Tap Controll (ON/OFF)
router.post('/update-onoff/:valveID', (req, res) => {
    const { valveID } = req.params;
    const { onoff } = req.body; // 0 or 1
  
    const query = `
      UPDATE schedule
      SET onoff = ?
      WHERE valveID = ?
    `;
  
    db.query(query, [onoff, valveID], (err, result) => {
      if (err) {
        console.error('Error updating onoff status:', err);
        res.status(500).json({ message: 'Database error' });
      } else {
        res.json({ message: 'onoff status updated successfully' });
      }
    });
  });

  module.exports = router;
