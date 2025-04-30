const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'MKaushik@602',
  database: 'job_board'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL Database');
  }
});

// ---------------------------------------------
// User Registration
app.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, password, role], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'User registered successfully' });
  });
});

// Fetch All Users (Admin purpose)
app.get('/users', (req, res) => {
  const sql = 'SELECT name, email, role FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// ---------------------------------------------
// Add New Job (Employer)
app.post('/api/add-job', (req, res) => {
  const { title, description, location, category, employer_id } = req.body;

  if (!title || !description || !location || !category || !employer_id) {
    return res.status(400).json({ message: 'All job fields are required' });
  }

  const sql = 'INSERT INTO jobs (title, description, location, category, employer_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, description, location, category, employer_id], (err, result) => {
    if (err) {
      console.error('Error adding job:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ success: true, message: 'Job added successfully' });
  });
});

// Fetch Jobs (with Filters)
app.get('/api/jobs', (req, res) => {
  const { search = '', category = '', location = '' } = req.query;
  
  let sql = `
    SELECT jobs.*, users.name AS employer_name 
    FROM jobs 
    JOIN users ON jobs.employer_id = users.id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    sql += ' AND jobs.title LIKE ?';
    params.push(`%${search}%`);
  }
  if (category) {
    sql += ' AND jobs.category = ?';
    params.push(category);
  }
  if (location) {
    sql += ' AND jobs.location = ?';
    params.push(location);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error fetching jobs:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// Delete Job by ID (Admin)
app.delete('/api/delete-job/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM jobs WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting job:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  });
});

// ---------------------------------------------
// Submit Job Application (Seeker)
app.post('/api/apply', (req, res) => {
  const { user_id, job_id } = req.body;

  if (!user_id || !job_id) {
    return res.status(400).json({ message: 'user_id and job_id are required' });
  }

  const sql = 'INSERT INTO applications (user_id, job_id) VALUES (?, ?)';
  db.query(sql, [user_id, job_id], (err, result) => {
    if (err) {
      console.error('Error submitting application:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ success: true, message: 'Application submitted successfully' });
  });
});

// ---------------------------------------------
// Login Route (Fixed with .promise().query)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length > 0) {
      res.json({
        success: true,
        user: {
          id: rows[0].id,
          role: rows[0].role
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ---------------------------------------------
// Start the Server
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});








