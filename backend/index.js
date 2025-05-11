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
  password: 'Lesaulnes2017',
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


app.get('/games', (req, res) => {
  const sql = 'SELECT * FROM game';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des jeux :', err.message);
      return res.status(500).json({ erreur: 'Erreur serveur' });
    }
    res.json(results); // envoie tous les jeux au front
  });
});

app.get('/game/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM game WHERE id_game = ' + id;
  console.log(sql);
  db.query(sql, (err, results) => {
    if (err) {
      console.log(res.status(500).json({ error: err.message }));
      return res.status(500).json({ error: err.message });
    } 
    if (results.length === 0) return res.status(404).json({ error: 'Jeu non trouvé' });
    console.log(results[0]);
    res.json(results[0]); // envoie le premier résultat
  });
});

app.get('/sessions/game/:id', (req, res) => {
  const gameId = req.params.id;
  const sql = 'SELECT * FROM session WHERE id_game = ?';

  db.query(sql, [gameId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des sessions :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    res.json(results);
  });
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
