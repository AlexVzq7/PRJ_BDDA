"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var express = require('express');

var cors = require('cors');

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var mysql = require('mysql2');

var app = express();
app.use(cors());
app.use(express.json()); // Connexion à MySQL

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'projet_bda'
});
db.connect(function (err) {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err.message);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
}); // Route de base

app.get('/', function (req, res) {
  res.json({
    success: true,
    message: 'Bienvenue sur l’API'
  });
}); // ROUTE LOGIN ETC

app.post('/register', function _callee2(req, res) {
  var _req$body, username, email, password;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          try {
            _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password;
            db.query('Select * FROM user WHERE email_user = ?', [email], function _callee(err, results) {
              var hashedpassword;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (!err) {
                        _context.next = 2;
                        break;
                      }

                      return _context.abrupt("return", res.status(500).json({
                        error: err.message
                      }));

                    case 2:
                      if (!(results.length > 0)) {
                        _context.next = 4;
                        break;
                      }

                      return _context.abrupt("return", res.status(400).json({
                        error: 'Cet email est déja utilisé'
                      }));

                    case 4:
                      _context.next = 6;
                      return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

                    case 6:
                      hashedpassword = _context.sent;
                      db.query('INSERT INTO user (name_user,email_user,password_user,is_online,role_user) VALUES (?,?,?,?,?)', [username, email, hashedpassword, 0, "user"], function (err, results) {
                        if (err) return res.status(500).json({
                          error: err.message
                        });
                        res.status(201).json({
                          message: 'Compte créé avec succès'
                        });
                      });

                    case 8:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            });
          } catch (error) {
            res.status(500).json({
              error: 'Erreur lors de la création du compte'
            });
          }

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.post('/login', function _callee4(req, res) {
  var _req$body2, email, password;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;

          if (!(!email || !password)) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Veuillez fournir email et mot de passe.'
          }));

        case 3:
          db.query('SELECT * FROM user WHERE email_user = ?', [email], function _callee3(err, results) {
            var user, valid;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!err) {
                      _context3.next = 2;
                      break;
                    }

                    return _context3.abrupt("return", res.status(500).json({
                      error: err.message
                    }));

                  case 2:
                    if (!(results.length === 0)) {
                      _context3.next = 4;
                      break;
                    }

                    return _context3.abrupt("return", res.status(401).json({
                      error: 'Email ou mot de passe incorrect'
                    }));

                  case 4:
                    user = results[0];
                    _context3.next = 7;
                    return regeneratorRuntime.awrap(bcrypt.compare(password, user.password_user));

                  case 7:
                    valid = _context3.sent;

                    if (valid) {
                      _context3.next = 10;
                      break;
                    }

                    return _context3.abrupt("return", res.status(401).json({
                      error: 'Email ou mot de passe incorrect'
                    }));

                  case 10:
                    // Mettre à jour is_online
                    db.query('UPDATE user SET is_online = 1 WHERE id_user = ?', [user.id_user], function (err2) {
                      if (err2) return res.status(500).json({
                        error: err2.message
                      });
                      res.json({
                        message: 'Connexion réussie',
                        user: {
                          id_user: user.id_user,
                          name_user: user.name_user,
                          email_user: user.email_user,
                          role_user: user.role_user // <-- ici on ajoute le rôle

                        }
                      });
                    });

                  case 11:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          });

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // Route sécurisée admin pour récupérer tous les utilisateurs depuis la vue admin_user_view

app.get('/admin/users', function (req, res) {
  // Ici tu peux ajouter une vérification de token/session si tu en utilises
  var sql = 'SELECT * FROM admin_user_view ORDER BY name_user';
  db.query(sql, function (err, results) {
    if (err) {
      console.error('Erreur récupération utilisateurs :', err.message);
      return res.status(500).json({
        error: 'Erreur serveur'
      });
    }

    res.json(results);
  });
}); // ROUTE GAMES 

app.get('/games', function (req, res) {
  var sql = 'SELECT * FROM game';
  db.query(sql, function (err, results) {
    if (err) {
      console.error('Erreur lors de la récupération des jeux :', err.message);
      return res.status(500).json({
        erreur: 'Erreur serveur'
      });
    }

    res.json(results); // envoie tous les jeux au front
  });
});
app.get('/game/:id', function (req, res) {
  var id = req.params.id;
  var sql = "\n    SELECT\n      g.id_game,\n      g.name_game,\n      g.thumbnail   AS image_url,\n      g.url         AS website,\n      g.year_game   AS release_date,\n      g.is_available,\n      g.rank_game,\n      g.total_ratings,\n      gd.description_game   AS description,\n      gd.game_publisher     AS publisher,\n      GROUP_CONCAT(DISTINCT c.type_category SEPARATOR ',') AS categories\n    FROM Game g\n    LEFT JOIN Game_details gd ON g.id_game = gd.id_game\n    LEFT JOIN have h         ON g.id_game = h.id_game\n    LEFT JOIN Category c     ON h.id_category = c.id_category\n    WHERE g.id_game = ?\n    GROUP BY\n      g.id_game,\n      gd.description_game,\n      gd.game_publisher\n  ";
  db.query(sql, [id], function (err, results) {
    if (err) {
      console.error('Erreur chargement jeu:', err.message);
      return res.status(500).json({
        error: err.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: 'Jeu non trouvé'
      });
    } // On renvoie l’objet jeu complet


    res.json(results[0]);
  });
});
app.get('/sessions/game/:id', function (req, res) {
  console.log("Hehe");
  var gameId = req.params.id;
  var sql = "\n    SELECT \n      s.id_session,\n      s.id_game,\n      s.id_host,\n      s.min_players,\n      s.max_players,\n      s.playing_time,\n      s.min_playtime,\n      s.max_playtime,\n      s.min_age,\n      s.starting_date,\n      u_host.name_user AS host_name,\n      u_part.id_user AS participant_id,\n      u_part.name_user AS participant_name,\n      u_part.trust_score AS participant_score\n    FROM Session s\n    JOIN User u_host ON s.id_host = u_host.id_user\n    LEFT JOIN participate p ON s.id_session = p.id_session\n    LEFT JOIN User u_part ON p.id_user = u_part.id_user\n    WHERE s.id_game = ?\n    ORDER BY s.id_session;\n  ";
  db.query(sql, [gameId], function (err, results) {
    if (err) {
      console.error('Erreur lors de la récupération des sessions :', err.message);
      return res.status(500).json({
        error: 'Erreur serveur'
      });
    } // Regrouper les résultats par session


    var sessionsMap = new Map();
    results.forEach(function (row) {
      if (!sessionsMap.has(row.id_session)) {
        console.log("Host Name : ", row.host_name);
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
    }); // Convertir map en tableau

    var sessions = Array.from(sessionsMap.values());
    res.json(sessions);
  });
});
app.post('/sessions/join', function (req, res) {
  var _req$body3 = req.body,
      id_session = _req$body3.id_session,
      id_user = _req$body3.id_user;

  if (!id_session || !id_user) {
    return res.status(400).json({
      error: 'id_session et id_user sont requis'
    });
  }

  var sql = 'CALL ajouter_participant(?, ?)';
  db.query(sql, [id_session, id_user], function (err, results) {
    if (err) {
      console.error('Erreur lors de l’ajout du participant :', err.message);
      return res.status(500).json({
        error: err.message
      });
    }

    res.json({
      message: 'Participant ajouté avec succès'
    });
  });
});
app.post('/sessions/leave', function (req, res) {
  var _req$body4 = req.body,
      id_session = _req$body4.id_session,
      id_user = _req$body4.id_user;

  if (!id_session || !id_user) {
    return res.status(400).json({
      error: 'id_session et id_user requis'
    });
  } // Suppression directe du participant


  db.query('DELETE FROM participate WHERE id_session = ? AND id_user = ?', [id_session, id_user], function (err, result) {
    if (err) {
      console.error('leave error:', err.message);
      return res.status(500).json({
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Participation non trouvée'
      });
    }

    res.json({
      message: 'Départ de session réussi'
    });
  });
});
app.post('/sessions/create', function (req, res) {
  var _req$body5 = req.body,
      min_joueurs = _req$body5.min_joueurs,
      max_joueurs = _req$body5.max_joueurs,
      temps_jeu = _req$body5.temps_jeu,
      min_duree = _req$body5.min_duree,
      max_duree = _req$body5.max_duree,
      age_min = _req$body5.age_min,
      jeu_id = _req$body5.jeu_id,
      date_debut = _req$body5.date_debut,
      id_host = _req$body5.id_host;

  if (!id_host || !jeu_id || !date_debut) {
    return res.status(400).json({
      error: 'Champs obligatoires manquants'
    });
  }

  var sql = 'CALL creer_session(?, ?, ?, ?, ?, ?, ?, ?, ?)';
  var params = [min_joueurs, max_joueurs, temps_jeu, min_duree, max_duree, age_min, jeu_id, date_debut, id_host];
  db.query(sql, params, function (err, results) {
    if (err) {
      console.error('Erreur création session :', err.message);
      return res.status(500).json({
        error: 'Erreur lors de la création de la session'
      });
    }

    res.json({
      message: 'Session créée avec succès'
    });
  });
}); // Modifier un jeu existant

app.put('/games/:id', function (req, res) {
  var id = req.params.id;
  var _req$body6 = req.body,
      name_game = _req$body6.name_game,
      year_game = _req$body6.year_game,
      thumbnail = _req$body6.thumbnail,
      url = _req$body6.url;
  year_game = "".concat(year_game, "-01-02");
  console.log(year_game);
  var sql = "\n    UPDATE game\n    SET name_game = ?, year_game = ?, thumbnail = ?, url = ?\n    WHERE id_game = ?\n  ";
  db.query(sql, [name_game, year_game, thumbnail, url, id], function (err, result) {
    if (err) {
      console.error('Erreur modification jeu :', err.message);
      return res.status(500).json({
        error: 'Erreur serveur'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Jeu non trouvé'
      });
    }

    res.json({
      message: 'Jeu modifié avec succès'
    });
  });
}); //RECHERCHE
// Endpoint pour récupérer les jeux (avec recherche)

app.get('/api/games', function (req, res) {
  var search = req.query.q || '';
  var sql = search ? "SELECT id_game AS id, name_game AS name, year_game, thumbnail FROM Game WHERE name_game LIKE ?" : "SELECT id_game AS id, name_game AS name, year_game, thumbnail FROM Game";
  var params = search ? ["%".concat(search, "%")] : [];
  db.query(sql, params, function (err, results) {
    if (err) {
      res.status(500).json({
        error: err
      });
      return;
    }

    res.json(results);
  });
});
app.get('/api/search', function _callee5(req, res) {
  var keyword, _ref, _ref2, rows;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          keyword = req.query.q || '';
          _context5.next = 3;
          return regeneratorRuntime.awrap(db.execute('CALL search_games(?)', [keyword]));

        case 3:
          _ref = _context5.sent;
          _ref2 = _slicedToArray(_ref, 1);
          rows = _ref2[0];
          res.json(rows[0]);

        case 7:
        case "end":
          return _context5.stop();
      }
    }
  });
});
app.get('/categories', function (req, res) {
  var sql = 'SELECT * FROM Category ORDER BY type_category';
  db.query(sql, function (err, results) {
    if (err) {
      console.error('Erreur récupération catégories :', err.message);
      return res.status(500).json({
        error: 'Erreur serveur'
      });
    }

    res.json(results);
  });
});
app.get('/games/category/:id_category', function (req, res) {
  var id_cat = req.params.id_category;
  var sql = "\n    SELECT g.*\n    FROM Game g\n    JOIN have h ON g.id_game = h.id_game\n    WHERE h.id_category = ?\n  ";
  db.query(sql, [id_cat], function (err, results) {
    if (err) {
      console.error('Erreur récupération jeux catégorie :', err.message);
      return res.status(500).json({
        error: 'Erreur serveur'
      });
    }

    res.json(results);
  });
}); // Exemple de route

app.get('/user', function (req, res) {
  db.query('SELECT * FROM user', function (err, results) {
    if (err) return res.status(500).json({
      erreur: err.message
    });
    res.json(results);
  });
});
app.listen(3000, function () {
  console.log('API en ligne sur http://localhost:3000');
});
//# sourceMappingURL=index.dev.js.map
