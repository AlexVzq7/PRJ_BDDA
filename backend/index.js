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
  password: 'root',
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

  db.query('SELECT * FROM user WHERE email_user = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = results[0];

    const valid = await bcrypt.compare(password, user.password_user);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Mettre à jour is_online
    db.query('UPDATE user SET is_online = 1 WHERE id_user = ?', [user.id_user], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      res.json({
        message: 'Connexion réussie',
        user: {
          id_user: user.id_user,
          name_user: user.name_user,
          email_user: user.email_user,
          role_user: user.role_user  // <-- ici on ajoute le rôle
        }
      });
    });
  });
});


// Route sécurisée admin pour récupérer tous les utilisateurs depuis la vue admin_user_view
app.get('/admin/users', (req, res) => {
  // Ici tu peux ajouter une vérification de token/session si tu en utilises

  const sql = 'SELECT * FROM admin_user_view ORDER BY name_user';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur récupération utilisateurs :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
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
  const sql = `
    SELECT
      g.id_game,
      g.name_game,
      g.thumbnail   AS image_url,
      g.url         AS website,
      g.year_game   AS release_date,
      g.is_available,
      g.rank_game,
      g.total_ratings,
      gd.description_game   AS description,
      gd.game_publisher     AS publisher,
      GROUP_CONCAT(DISTINCT c.type_category SEPARATOR ',') AS categories
    FROM Game g
    LEFT JOIN Game_details gd ON g.id_game = gd.id_game
    LEFT JOIN have h         ON g.id_game = h.id_game
    LEFT JOIN Category c     ON h.id_category = c.id_category
    WHERE g.id_game = ?
    GROUP BY
      g.id_game,
      gd.description_game,
      gd.game_publisher
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erreur chargement jeu:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Jeu non trouvé' });
    }
    // On renvoie l’objet jeu complet
    res.json(results[0]);
  });
});

app.get('/sessions/game/:id', (req, res) => {
  console.log("Hehe");
  const gameId = req.params.id;
  const sql = `
    SELECT 
      s.id_session,
      s.id_game,
      s.id_host,
      s.min_players,
      s.max_players,
      s.playing_time,
      s.min_playtime,
      s.max_playtime,
      s.min_age,
      s.starting_date,
      u_host.name_user AS host_name,
      u_part.id_user AS participant_id,
      u_part.name_user AS participant_name,
      u_part.trust_score AS participant_score
    FROM Session s
    JOIN User u_host ON s.id_host = u_host.id_user
    LEFT JOIN participate p ON s.id_session = p.id_session
    LEFT JOIN User u_part ON p.id_user = u_part.id_user
    WHERE s.id_game = ?
    ORDER BY s.id_session;
  `;

  db.query(sql, [gameId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des sessions :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    // Regrouper les résultats par session
    const sessionsMap = new Map();

    results.forEach(row => {
      if (!sessionsMap.has(row.id_session)) {
        console.log("Host Name : ",row.host_name);
        sessionsMap.set(row.id_session, {
          id_session: row.id_session,
          id_game: row.id_game,
          id_host: row.id_host,
          host_name: row.host_name,
          min_players: row.min_players,
          max_players: row.max_players,
          playing_time: row.playing_time,
          min_playtime: row.min_playtime,
          max_playtime: row.max_playtime,
          min_age: row.min_age,
          starting_date: row.starting_date,
          participants: []
        });
      }
      if (row.participant_id) {
        sessionsMap.get(row.id_session).participants.push({
          id_user: row.participant_id,
          name_user: row.participant_name,
          trust_score: row.participant_score
        });
      }
    });

    // Convertir map en tableau
    const sessions = Array.from(sessionsMap.values());

    res.json(sessions);
  });
});

app.post('/sessions/join', (req, res) => {
  const { id_session, id_user } = req.body;

  if (!id_session || !id_user) {
    return res.status(400).json({ error: 'id_session et id_user sont requis' });
  }

  const sql = 'CALL ajouter_participant(?, ?)';

  db.query(sql, [id_session, id_user], (err, results) => {
    if (err) {
      console.error('Erreur lors de l’ajout du participant :', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Participant ajouté avec succès' });
  });
});


app.post('/sessions/leave', (req, res) => {
  const { id_session, id_user } = req.body
  if (!id_session || !id_user) {
    return res.status(400).json({ error: 'id_session et id_user requis' })
  }
  // Suppression directe du participant
  db.query(
    'DELETE FROM participate WHERE id_session = ? AND id_user = ?',
    [id_session, id_user],
    (err, result) => {
      if (err) {
        console.error('leave error:', err.message)
        return res.status(500).json({ error: err.message })
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Participation non trouvée' })
      }
      res.json({ message: 'Départ de session réussi' })
    }
  )
});

  app.post('/sessions/create', (req, res) => {
    const {
      min_joueurs, max_joueurs, temps_jeu,
      min_duree, max_duree, age_min,
      jeu_id, date_debut, id_host
    } = req.body;

    if (!id_host || !jeu_id || !date_debut) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    const sql = 'CALL creer_session(?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [
      min_joueurs, max_joueurs, temps_jeu,
      min_duree, max_duree, age_min,
      jeu_id, date_debut, id_host
    ];

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('Erreur création session :', err.message);
        return res.status(500).json({ error: 'Erreur lors de la création de la session' });
      }
      res.json({ message: 'Session créée avec succès' });
    });
  });



// Modifier un jeu existant
app.put('/games/:id', (req, res) => {
  const id = req.params.id;
  let { name_game, year_game, thumbnail, url } = req.body;

  year_game = `${year_game}-01-02`;
 
  console.log(year_game);

  const sql = `
    UPDATE game
    SET name_game = ?, year_game = ?, thumbnail = ?, url = ?
    WHERE id_game = ?
  `;

  db.query(sql, [name_game, year_game, thumbnail, url, id], (err, result) => {
    if (err) {
      console.error('Erreur modification jeu :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Jeu non trouvé' });
    }
    res.json({ message: 'Jeu modifié avec succès' });
  });
});


//RECHERCHE
// Endpoint pour récupérer les jeux (avec recherche)
app.get('/api/games', (req, res) => {
  const search = req.query.q || '';
  const sql = search
    ? "SELECT id_game AS id, name_game AS name, year_game, thumbnail FROM Game WHERE name_game LIKE ?"
    : "SELECT id_game AS id, name_game AS name, year_game, thumbnail FROM Game";
  const params = search ? [`%${search}%`] : [];
  db.query(sql, params, (err, results) => {
    if (err) {
      res.status(500).json({error: err});
      return;
    }
    res.json(results);
  });
});

app.get('/api/search',async(req,res)=>{
  const keyword = req.query.q || '';
  const [rows] = await db.execute('CALL search_games(?)',[keyword]);
  res.json(rows[0]);
})

app.get('/categories', (req, res) => {
  const sql = 'SELECT * FROM Category ORDER BY type_category';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur récupération catégories :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
});

app.get('/games/category/:id_category', (req, res) => {
  const id_cat = req.params.id_category;
  const sql = `
    SELECT g.*
    FROM Game g
    JOIN have h ON g.id_game = h.id_game
    WHERE h.id_category = ?
  `;
  db.query(sql, [id_cat], (err, results) => {
    if (err) {
      console.error('Erreur récupération jeux catégorie :', err.message);
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