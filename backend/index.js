const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tonMDP',
  database: 'projet_bda'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err.message);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

// Route de base
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Bienvenue sur l’API' });
});



// Exemple de route
app.get('/user', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) return res.status(500).json({ erreur: err.message });
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('API en ligne sur http://localhost:3000');
});
