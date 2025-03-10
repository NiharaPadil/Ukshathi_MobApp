const express = require("express");
const router = express.Router();
const db = require("../server"); 

// Get Controllers by User ID
router.get('/controller/:id', (req, res) => {
  const id = req.params.id;
  const query = `
      SELECT c.deviceType
      FROM controller c
      WHERE c.userID = ?;
  `;
  
  db.query(query, [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results.map(row => row.deviceType));
  });
});

// Get Nodes by User ID
router.get('/nodes', (req, res) => {
  const { userID } = req.query;
  
  if (!userID) {
      return res.status(400).json({ message: 'userID is required' });
  }

  const query = `
        SELECT N.*, U.firstName, U.lastName
        FROM Node N
        JOIN Controller C ON N.controllerID = C.controllerID
        JOIN userData U ON C.userID = U.userID
        WHERE C.userID = ?;
    `;

  db.query(query, [userID], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error', error: err });
      }
      
      if (results.length === 0) {
          return res.status(404).json({ message: 'No nodes found for this userID' });
      }
      console.log(results);
      res.json(results);
  });
});

// Get Valves by Node ID
router.get('/nodes/:node_id/valves', (req, res) => {
  const node_id = req.params.node_id;

  if (!node_id) {
      return res.status(400).json({ message: 'Invalid node_id' });
  }

  const query = 'SELECT * FROM valve WHERE nodeID = ?';

  db.query(query, [node_id], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'No valves found for this node_id' });
      }

      res.json(results);
  });
});

module.exports = router;