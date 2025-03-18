const express = require('express');
const cors = require('cors');
const db = require('../server');
const app = express();
const multer = require('multer');
const path = require('path');

app.use(cors());
app.use(express.json());


// Image Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });

  
  // Submit Form Data
app.post('/submit', upload.single('image'), (req, res) => {
    const { name, email, queryType, message, feedback } = req.body;
    const imagePath = req.file ? req.file.path : null;
  
    const sql = `
      INSERT INTO queries_and_feedback 
      (name, email, query_type, message, image_path, feedback) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    db.query(
      sql,
      [name, email, queryType, message, imagePath, feedback],
      (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to submit data' });
        }
        res.json({ message: 'Data submitted successfully!' });
      }
    );
  });

  module.exports = app;