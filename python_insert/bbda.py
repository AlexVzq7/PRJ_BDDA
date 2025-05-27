import mysql.connector
import pandas as pd

# Connexion à la base de données
connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password='2539',
    database='projet_bda'
)
cursor = connection.cursor()

# Lecture du CSV
csv_file = 'ratings.csv'
data = pd.read_csv(csv_file)

# Parcours des lignes du DataFrame et insertion dans la table Game
for index, row in data.iterrows():
    # Conversion de l'année au format DATE (YYYY-01-01)
    year_game = f"{int(row['year'])}-01-01" if not pd.isnull(row['year']) else None
    # Préparation de la requête
    sql = """
        INSERT INTO Game (id_game, rank_game, url, thumbnail, name_game, year_game, is_available)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            rank_game=VALUES(rank_game),
            url=VALUES(url),
            thumbnail=VALUES(thumbnail),
            name_game=VALUES(name_game),
            year_game=VALUES(year_game),
            is_available=VALUES(is_available)
    """
    values = (
        int(row['id']),
        int(row['rank']),
        row['url'],
        row['thumbnail'],
        row['name'],
        year_game,
        True  # ou False selon ta logique métier
    )
    try:
        cursor.execute(sql, values)
    except Exception as e:
        print(f"Erreur à la ligne {index}: {e}")

# Commit et fermeture
connection.commit()
cursor.close()
connection.close()
print("Import terminé !")
