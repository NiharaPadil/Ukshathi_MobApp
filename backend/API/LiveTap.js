//LiveTap.js
const express = require('express');
const cors = require('cors');
const db = require('../server');
const app = express();

app.use(cors());
app.use(express.json());

// Unified valve status endpoint
app.get('/valves/:id', (req, res) => {
    const valveId = req.params.id;

    db.query(
        `SELECT 
            valveID,
            ManualOP,
            DIK,
            CASE
                WHEN DIK = 1 THEN 'Processing'
                WHEN DIK = 2 THEN 'CMD Successful'
                WHEN DIK = 3 THEN 'CMD Failed'
            END AS StatusDescription
        FROM \`fetch\`
        WHERE valveID = ?`,
        [valveId],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database query failed' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Valve not found' });
            }

            const valve = results[0];
            res.json({
                valveID: valve.valveID,
                state: valve.ManualOP === 0 ? 'ON' : 'OFF',
                status: valve.StatusDescription,
                ManualOP: valve.ManualOP,
                DIK: Number(valve.DIK) 
            });
        }
    );
});

// Simplified toggle endpoint
app.post('/valves/:id/toggle', async (req, res) => {
    const valveId = req.params.id;

    try {
        // Get current state
        const [current] = await db.query(
            'SELECT ManualOP FROM `fetch` WHERE valveID = ?',
            [valveId]
        );

        if (current.length === 0) {
            return res.status(404).json({ error: 'Valve not found' });
        }

        // Toggle ManualOP and set DIK to Processing
        const newManualOP = current[0].ManualOP === 0 ? 1 : 0;
        
        await db.query(
            `UPDATE \`fetch\` 
            SET ManualOP = ?, DIK = 1 
            WHERE valveID = ?`,
            [newManualOP, valveId]
        );

        res.json({
            newManualOP,
            dik: 1,
            message: 'Processing'
        });

    } catch (err) {
        console.error('Toggle error:', err);
        res.status(500).json({ error: 'Toggle failed' });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;