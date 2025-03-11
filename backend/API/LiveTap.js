const express = require("express");
const router = express.Router();
const db = require("../server");
const mysql = require("mysql2");

// Get current valve states
router.get('/valves/:id', (req, res) => {
    db.query(`
        SELECT 
            valveID,
            ManualOP,
            DIK,
            CASE 
                WHEN ManualOP = 1 THEN  
                    CASE 
                        WHEN DIK IN (1,2) THEN 0 
                        WHEN DIK = 3 THEN 1       
                    END
                WHEN ManualOP = 0 THEN  
                    CASE 
                        WHEN DIK = 2 THEN 1       
                        WHEN DIK IN (1,3) THEN 0  
                    END
            END AS NewManualOP,
            CASE
                WHEN DIK = 1 THEN 'Processing'
                WHEN DIK = 2 THEN 'CMD Successful'
                WHEN DIK = 3 THEN 'CMD Failed'
            END AS StatusDescription
        FROM \`fetch\`  -- ✅ Correctly using backticks
    `, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Toggle valve state
router.post('/valves/:id/toggle', (req, res) => {
    const valveId = req.params.id;

    db.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return res.status(500).json({ error: err.message });
            }

            // Lock row for update
            connection.query(
                'SELECT ManualOP, DIK FROM `fetch` WHERE valveID = ? FOR UPDATE',
                [valveId],
                (err, current) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ error: err.message });
                        });
                    }

                    if (current.length === 0) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(404).json({ error: 'Valve not found' });
                        });
                    }

                    const currentState = current[0];

                    // Check if previous command is still processing
                    if (currentState.DIK === 1) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(423).json({ error: 'Operation already in progress' });
                        });
                    }

                    // Calculate new state
                    const newManualOP = currentState.ManualOP === 0 ? 1 : 0;

                    // Update state with processing status
                    connection.query(
                        `UPDATE \`fetch\` 
                        SET ManualOP = ?, DIK = 1 
                        WHERE valveID = ?`,
                        [newManualOP, valveId],
                        (err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ error: err.message });
                                });
                            }

                            connection.commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        res.status(500).json({ error: err.message });
                                    });
                                }

                                connection.release();
                                res.json({
                                    message: 'Command received - processing',
                                    newState: newManualOP,
                                    valveId
                                });
                            });
                        }
                    );
                }
            );
        });
    });
});

// Update command status (to be called by your hardware/worker)
router.put('/valves/:id/status', (req, res) => {
    const valveId = req.params.id;
    const { dikStatus } = req.body;

    if (![2, 3].includes(dikStatus)) {
        return res.status(400).json({ error: 'Invalid status code' });
    }

    db.query(
        `UPDATE \`fetch\` 
        SET DIK = ?
        WHERE valveID = ?`,
        [dikStatus, valveId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Valve not found' });
            }

            res.json({
                message: `Status updated to ${dikStatus === 2 ? 'Successful' : 'Failed'}`,
                valveId
            });
        }
    );
});

module.exports = router;