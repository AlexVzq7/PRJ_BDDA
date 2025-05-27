drop database projet_bda;
create database projet_bda;
USE projet_bda;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS have;
DROP TABLE IF EXISTS participate;
DROP TABLE IF EXISTS rate;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS Game_details;
DROP TABLE IF EXISTS Session;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Game;

SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE IF NOT EXISTS Game(
   id_game INT,
   rank_game INT,
   url VARCHAR(255),
   thumbnail VARCHAR(255),
   name_game VARCHAR(255) NOT NULL,
   year_game DATE,
   is_available BOOLEAN NOT NULL, 
   PRIMARY KEY(id_game),
   UNIQUE(name_game)
);

CREATE TABLE IF NOT EXISTS Session(
   id_session INT auto_increment,
   min_players INT,
   max_players INT,
   playing_time TIME,
   min_playtime TIME,
   max_playtime TIME,
   min_age INT,
   id_game INT NOT NULL,
   starting_date DATETIME NOT NULL,
   PRIMARY KEY(id_session),
   FOREIGN KEY(id_game) REFERENCES Game(id_game)
);

CREATE TABLE IF NOT EXISTS User(
   id_user INT auto_increment,
   name_user VARCHAR(50),
   email_user VARCHAR(50),
   password_user VARCHAR(250) NOT NULL,
   is_online BOOLEAN NOT NULL,
   trust_score INT default 0,
   city_user VARCHAR(50),
   role_user VARCHAR(50) NOT NULL,
   PRIMARY KEY(id_user),
   unique(email_user),
   unique(name_user)
);

CREATE TABLE IF NOT EXISTS Game_details(
   id_game INT,
   id_details INT,
   description_game VARCHAR(50),
   game_publisher VARCHAR(50),
   PRIMARY KEY(id_game, id_details),
   FOREIGN KEY(id_game) REFERENCES Game(id_game)
);

CREATE TABLE IF NOT EXISTS Category(
   id_category INT,
   type_category VARCHAR(50),
   PRIMARY KEY(id_category)
);

CREATE TABLE IF NOT EXISTS rate(
   id_game INT,
   id_user INT,
   grade INT,
   PRIMARY KEY(id_game, id_user),
   FOREIGN KEY(id_game) REFERENCES Game(id_game),
   FOREIGN KEY(id_user) REFERENCES User(id_user)
);

CREATE TABLE IF NOT EXISTS participate(
   id_session INT auto_increment,
   id_user INT,
   PRIMARY KEY(id_session, id_user),
   FOREIGN KEY(id_session) REFERENCES Session(id_session),
   FOREIGN KEY(id_user) REFERENCES User(id_user)
);

CREATE TABLE IF NOT EXISTS message(
   id_user INT,
   id_user_1 INT,
   content_message VARCHAR(50) NOT NULL,
   date_message DATETIME,
   id_message INT NOT NULL,
   PRIMARY KEY(id_message),
   FOREIGN KEY(id_user) REFERENCES User(id_user),
   FOREIGN KEY(id_user_1) REFERENCES User(id_user)
);


CREATE TABLE IF NOT EXISTS have(
   id_game INT,
   id_category INT,
   PRIMARY KEY(id_game, id_category),
   FOREIGN KEY(id_game) REFERENCES Game(id_game),
   FOREIGN KEY(id_category) REFERENCES Category(id_category)
);

ALTER TABLE Session 
ADD CONSTRAINT chk_min_players CHECK (min_players >= 1),
ADD CONSTRAINT chk_max_players CHECK (max_players >= min_players),
ADD CONSTRAINT chk_min_age CHECK (min_age >= 0);

ALTER TABLE rate 
ADD CONSTRAINT chk_grade CHECK (grade BETWEEN 0 AND 5);

ALTER TABLE User 
ADD CONSTRAINT chk_role_user CHECK (role_user IN ('admin', 'user'));

ALTER TABLE Game 
ADD total_ratings INT DEFAULT 0;

CREATE TABLE IF NOT EXISTS favoris (
    id_user INT,
    id_game INT,
    PRIMARY KEY(id_user, id_game),
    FOREIGN KEY(id_user) REFERENCES User(id_user),
    FOREIGN KEY(id_game) REFERENCES Game(id_game)
);


ALTER TABLE Session
ADD COLUMN id_host INT NOT NULL AFTER id_game,
ADD CONSTRAINT fk_session_host FOREIGN KEY (id_host) REFERENCES User(id_user);

CREATE INDEX idx_message_users ON message(id_user, id_user_1);

CREATE INDEX idx_message_date ON message(date_message);

CREATE INDEX idx_game_name ON Game(name_game);
CREATE INDEX idx_participate_user ON participate(id_user);
CREATE INDEX idx_participate_session ON participate(id_session);

DROP TRIGGER if exists check_max_players; 
DROP TRIGGER if exists prevent_self_message; 
DROP TRIGGER if exists validate_rating_participation; 
DROP TRIGGER if exists set_user_online_on_participation; 


DELIMITER //
CREATE TRIGGER check_max_players
BEFORE INSERT ON participate
FOR EACH ROW
BEGIN
    DECLARE current_players INT;
    DECLARE max_players_limit INT;

    SELECT COUNT(*) INTO current_players
    FROM participate
    WHERE id_session = NEW.id_session;

    SELECT max_players INTO max_players_limit
    FROM Session
    WHERE id_session = NEW.id_session;

    IF current_players >= max_players_limit THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Nombre maximum de joueurs atteint pour cette session.';
    END IF;
END;
//
DELIMITER ;


DELIMITER $$
CREATE TRIGGER verif_places_disponibles
BEFORE INSERT ON participate
FOR EACH ROW
BEGIN
    DECLARE nb_places INT;
    DECLARE nb_participants INT;

    SELECT max_players INTO nb_places FROM Session WHERE id_session = NEW.id_session;
    SELECT COUNT(*) INTO nb_participants FROM participate WHERE id_session = NEW.id_session;

    IF nb_participants >= nb_places THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Session pleine, insertion impossible';
    END IF;
END$$
DELIMITER ;


DELIMITER //
CREATE TRIGGER prevent_self_message
BEFORE INSERT ON message
FOR EACH ROW
BEGIN
    IF NEW.id_user = NEW.id_user_1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Un utilisateur ne peut pas s’envoyer un message à lui-même.';
    END IF;
END;
//
DELIMITER ;


DELIMITER //
CREATE TRIGGER validate_rating_participation
BEFORE INSERT ON rate
FOR EACH ROW
BEGIN
    DECLARE session_exists INT;

    SELECT COUNT(*) INTO session_exists
    FROM Session s
    JOIN participate p ON p.id_session = s.id_session
    WHERE s.id_game = NEW.id_game AND p.id_user = NEW.id_user;
    IF session_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'L’utilisateur ne peut noter un jeu auquel il n’a pas joué.';
    END IF;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER set_user_online_on_participation
AFTER INSERT ON participate
FOR EACH ROW
BEGIN
    UPDATE User
    SET is_online = TRUE
    WHERE id_user = NEW.id_user;
END;
//
DELIMITER ;






DELIMITER //

CREATE TRIGGER validate_email_format
BEFORE INSERT ON User
FOR EACH ROW
BEGIN
    IF NEW.email_user NOT REGEXP '^[A-Za-z0-9.%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Format email invalide : doit être de type exemple@domaine.ext';
    END IF;
END//

CREATE TRIGGER validate_email_format_update
BEFORE UPDATE ON User
FOR EACH ROW
BEGIN
    IF NEW.email_user NOT REGEXP '^[A-Za-z0-9.%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Format email invalide : doit être de type exemple@domaine.ext';
    END IF;
END//

DELIMITER ;


DROP TRIGGER IF EXISTS trg_before_insert_have;


DELIMITER //

CREATE TRIGGER trg_before_insert_have
BEFORE INSERT ON have
FOR EACH ROW
BEGIN
  -- Si la catégorie n'existe pas, on l'ajoute AVANT la vérification FK
  IF NOT EXISTS (
    SELECT 1
      FROM Category
     WHERE id_category = NEW.id_category
  ) THEN
    INSERT INTO Category (id_category, type_category)
    VALUES (
      NEW.id_category,
      CONCAT('Catégorie ', NEW.id_category)
    );
  END IF;
END;
//

DELIMITER ;

DROP PROCEDURE if exists creer_session;

DELIMITER $$
CREATE PROCEDURE creer_session (
    IN min_joueurs INT,
    IN max_joueurs INT,
    IN temps_jeu TIME,
    IN min_duree TIME,
    IN max_duree TIME,
    IN age_min INT,
    IN jeu_id INT,
    IN date_debut DATETIME,
    IN id_host INT
)
BEGIN
    INSERT INTO Session (
        min_players, max_players, playing_time,
        min_playtime, max_playtime,
        min_age, id_game, starting_date, id_host
    )
    VALUES (
        min_joueurs, max_joueurs, temps_jeu,
        min_duree, max_duree,
        age_min, jeu_id, date_debut, id_host
    );
END $$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE envoyer_message (
    IN expediteur INT,
    IN destinataire INT,
    IN contenu VARCHAR(50),
    IN date_envoi DATETIME
)
BEGIN
    DECLARE max_id INT;

    SELECT IFNULL(MAX(id_message), 0) + 1 INTO max_id FROM message;

    INSERT INTO message (
        id_user, id_user_1, content_message, date_message, id_message
    ) VALUES (
        expediteur, destinataire, contenu, date_envoi, max_id
    );
END $$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE rejoindre_session (
    IN user_id INT,
    IN session_id INT
)
BEGIN
    INSERT INTO participate (id_session, id_user)
    VALUES (session_id, user_id);
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE toggle_jeu_favoris (
    IN user_id INT,
    IN game_id INT
)
BEGIN
    DECLARE jeu_existe INT;

    SELECT COUNT(*) INTO jeu_existe
    FROM favoris
    WHERE id_user = user_id AND id_game = game_id;

    IF jeu_existe = 0 THEN
        INSERT INTO favoris (id_user, id_game)
        VALUES (user_id, game_id);
    ELSE
        DELETE FROM favoris
        WHERE id_user = user_id AND id_game = game_id;
    END IF;
END $$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE ajouter_participant (
    IN p_id_session INT,
    IN p_id_user INT
)
BEGIN
    -- Vérifier si places disponibles
    DECLARE nb_places INT;
    DECLARE nb_participants INT;

    SELECT max_players INTO nb_places FROM Session WHERE id_session = p_id_session;
    SELECT COUNT(*) INTO nb_participants FROM participate WHERE id_session = p_id_session;

    IF nb_participants < nb_places THEN
        INSERT INTO participate (id_session, id_user) VALUES (p_id_session, p_id_user);
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Session pleine, impossible d’ajouter un participant';
    END IF;
END$$

DELIMITER ;



DELIMITER //
CREATE PROCEDURE search_games(IN keyword VARCHAR(100))
BEGIN
    SELECT 
        id_game AS id,
        name_game AS name,
        year_game AS year,
        thumbnail
    FROM Game
    WHERE name_game LIKE CONCAT('%', keyword, '%')
    ORDER BY name_game
    LIMIT 5;
END //

DELIMITER ;

-- Vider proprement les tables avant de réinsérer
SET FOREIGN_KEY_CHECKS=0; -- désactive les contraintes
TRUNCATE TABLE have;
TRUNCATE TABLE message;
TRUNCATE TABLE participate;
TRUNCATE TABLE rate;
TRUNCATE TABLE Session;
TRUNCATE TABLE Game_details;
TRUNCATE TABLE Category;
TRUNCATE TABLE User;
TRUNCATE TABLE Game;
SET FOREIGN_KEY_CHECKS=1; -- réactive les contraintes


-- Game
INSERT INTO Game (id_game, rank_game, url, thumbnail, name_game, year_game, is_available)
VALUES 
(1, 3, 'https://game1.com', 'thumb1.jpg', 'Catan', '1995-01-01', TRUE),
(2, 4, 'https://game2.com', 'thumb2.jpg', '7 Wonders', '2010-01-01', TRUE),
(3, 2, 'https://game3.com', 'thumb3.jpg', 'Terraforming Mars', '2016-01-01', FALSE);

-- User
INSERT INTO User (id_user, name_user, email_user, password_user, is_online, city_user, role_user)
VALUES 
(1, 'Alice', 'alice@email.com', 'password123', TRUE, 'Paris', 'user'),
(2, 'Bob', 'bob@email.com', 'password456', FALSE, 'Lyon', 'user'),
(3, 'Charlie', 'charlie@email.com', 'password789', TRUE, 'Marseille', 'user'),
(4, 'admin', 'admin@admin.com', '$2b$10$gQ74fSHktAYWzAYTYo8i/O7BsIw1ZU1sknUnSOegMGacLU4RUU2tu', TRUE, 'Paris', 'admin');


-- Category
INSERT INTO Category (id_category, type_category)
VALUES 
(1, 'Stratégie'),
(2, 'Science-fiction'),
(3, 'Civilisation');

-- Game_details
INSERT INTO Game_details (id_game, id_details, description_game, game_publisher)
VALUES 
(1, 1, 'Jeu de gestion de ressources', 'Kosmos'),
(2, 1, 'Jeu de cartes rapide', 'Repos Production'),
(3, 1, 'Conquête de Mars', 'Stronghold Games');

-- Session
-- Sessions avec id_host
INSERT INTO Session (
  min_players, max_players, playing_time, min_playtime, max_playtime, min_age, id_game, id_host, starting_date
)
VALUES 
(3, 4, '01:00:00', '00:45:00', '01:30:00', 10, 1, 1, '2025-05-27 11:30:00'),
(2, 7, '00:45:00', '00:30:00', '01:00:00', 10, 2, 2, '2025-05-04 11:30:00'),
(1, 5, '02:00:00', '01:30:00', '02:30:00', 12, 3, 3, '2025-05-04 11:30:00');






-- participate
INSERT INTO participate (id_session, id_user)
VALUES 
(1, 1),
(1, 2),
(2, 2),
(2, 3),
(3, 1),
(3, 3);

-- message
INSERT INTO message (id_user, id_user_1, content_message, date_message, id_message)
VALUES 
(1, 2, 'Salut Bob, prêt pour Catan ?', '2025-04-28 18:30:00', 100),
(2, 1, 'Oui !', '2025-04-28 18:31:00', 101),
(1, 2, "C'est partie", '2025-04-28 18:32:00', 102),
(3, 1, 'Charlie rejoindra S3.', '2025-04-28 18:35:00', 103);

-- have
INSERT INTO have (id_game, id_category)
VALUES 
(1, 1), -- Catan => Stratégie
(2, 3), -- 7 Wonders => Civilisation
(3, 1), -- Terraforming Mars => Stratégie
(3, 2); -- Terraforming Mars => Science-fiction

select * from category;




DROP VIEW IF EXISTS Available_game; 
-- Creer une vue permettant de voir les jeux actuellement disponible 
CREATE VIEW Available_game AS 
SELECT 
    Game.id_game, 
    Game.name_game, 
    Game.year_game, 
    Game_details.description_game, 
    Game_details.game_publisher 
FROM Game 
JOIN Game_details USING(id_game) 
WHERE Game.is_available = TRUE 
GROUP BY 
    Game.id_game, 
    Game.name_game, 
    Game.year_game, 
    Game_details.description_game, 
    Game_details.game_publisher;


DROP VIEW IF EXISTS Player_session_info; 
-- Creer une vue permettant de voir les utilisateurs d'une session en cours 
CREATE VIEW Player_session_info AS 
SELECT 
User.id_user, 
User.name_user, 
User.email_user, 
Session.id_session, 
Game.name_game
FROM participate p 
JOIN  Session using(id_session)
JOIN User using(id_user) 
JOIN Game using(id_game) 
WHERE User.is_online = TRUE; 

DROP VIEW IF EXISTS message_history;

-- CrÃ©ation d'une vue permettant de voir les messages entre deux utilisateurs
CREATE VIEW message_history AS
SELECT 
    u1.name_user AS Sender, 
    u2.name_user AS Receiver, 
    m.content_message, 
    m.date_message 
FROM message m 
JOIN User u1 ON m.id_user = u1.id_user
JOIN User u2 ON m.id_user_1 = u2.id_user 
ORDER BY m.date_message;

CREATE OR REPLACE VIEW admin_user_view AS
SELECT 
  id_user,
  name_user,
  email_user,
  role_user,
  city_user,
  trust_score
FROM User;


DELIMITER $$

CREATE FUNCTION get_average_rating(gameId INT)
RETURNS DECIMAL(3,2)
DETERMINISTIC
BEGIN
    DECLARE avg_rating DECIMAL(3,2);

    SELECT AVG(grade)
    INTO avg_rating
    FROM rate
    WHERE id_game = gameId;

    RETURN IFNULL(avg_rating, 0);
END$$

DELIMITER ;

-- retourne le rôle (admin ou user) d’un utilisateur donné.
DELIMITER $$

CREATE FUNCTION get_user_role(userId INT)
RETURNS VARCHAR(10)
DETERMINISTIC
BEGIN
    DECLARE user_role VARCHAR(10);

    SELECT role_user
    INTO user_role
    FROM User
    WHERE id_user = userId;

    RETURN user_role;
END$$

DELIMITER ;

-- retourne le nombre de jeux différents auxquels un utilisateur a participé via les sessions.

DELIMITER $$

CREATE FUNCTION get_number_of_games_by_user(userId INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE nb_games INT;

    SELECT COUNT(DISTINCT s.id_game)
    INTO nb_games
    FROM participate p
    JOIN Session s ON p.id_session = s.id_session
    WHERE p.id_user = userId;

    RETURN nb_games;
END$$

DELIMITER ;
