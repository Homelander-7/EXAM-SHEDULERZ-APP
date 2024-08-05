const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 5500;
const path = require('path'); // Make sure to import the path module

app.use(cors()); // Enable CORS for all routes

app.use(express.static(path.join(__dirname)));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Specify allowed origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Specify allowed methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Specify allowed headers
  res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials
  res.header('Access-Control-Expose-Headers', 'Content-Length, X-Custom-Header'); // Expose custom headers
  res.header('Access-Control-Max-Age', '3600'); // Cache preflight response for 1 hour

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // No content
  }
  
  next();
});


// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'school',
  port:'3300'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});
app.get('/jj',(req,res) =>{
  res.send('Hello Joshua HAHAHA');
});

// API endpoint to get faculty and department data
app.get('/jj/api/faculty-departments', (req, res) => {
  const query = `
    SELECT 
    f.name AS name, 
    f.department_code AS department,
    (SELECT GROUP_CONCAT(c.course_code)
     FROM courses c
     WHERE c.department_code = f.department_code) AS courses
FROM 
    faculty f;
    
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }

    try {
      const rdata= JSON.stringify(results);
      const parsedata = typeof rdata === 'string' ? JSON.parse(rdata) : rdata;
      res.json(parsedata);
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      res.status(500).send('Error parsing data');
    }
});
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
