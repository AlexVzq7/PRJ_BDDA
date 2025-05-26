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


// ROUTE LOGIN ETC

app.post('/register',async(req,res)=>{
  try{
    const { username,email,password} =req.body;

    db.query('Select * FROM user WHERE email_user = ?',[email],async(err,results)=>{
      if(err) return res.status(500).json({error:err.message});

      if(results.length >0){
        return res.status(400).json({error:'Cet email est déja utilisé'});
      }

      const hashedpassword = await bcrypt.hash(password,10);

      db.query(
        'INSERT INTO user (name_user,email_user,password_user,is_online,role_user) VALUES (?,?,?,?,?)',
        [username,email,hashedpassword,0,"user"],
        (err,results) =>{
          if(err) return res.status(500).json({error: err.message});
          res.status(201).json({message:'Compte créé avec succès'})
        }
      );
    });

  }catch(error){
    res.status(500).json({error:'Erreur lors de la création du compte'})
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Veuillez fournir email et mot de passe.' });
  }

  // Cette partie doit être à l'intérieur de la route login
  db.query('SELECT * FROM user WHERE email_user = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    const user = results[0]; // Correction: results, pas result
    
    const valid = await bcrypt.compare(password, user.password_user);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email_user }, 'SECRET', { expiresIn: '1h' });
    
    db.query('UPDATE user SET is_online = 1 WHERE id_user = ?', [user.id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Connexion réussie', token });
    });
  });
});




// ROUTE GAMES 
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
