<template>
    <div class="dashboard-games">
      <h1>Dashboard Admin - Gestion des Jeux</h1>
  
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <div v-if="loading">Chargement...</div>
  
      <div class="games-container" v-if="games.length">
        <div v-for="game in games" :key="game.id_game" class="game-card">
          <div v-if="editingGameId !== game.id_game">
            <img :src="game.thumbnail" alt="Image du jeu" class="thumbnail" />
            <h2>{{ game.name_game }}</h2>
            <p><strong>Année :</strong> {{ game.year_game }}</p>
            <p><strong>URL :</strong> <a :href="game.url" target="_blank">{{ game.url }}</a></p>
            <button @click="startEditing(game)">Modifier</button>
          </div>
  
          <div v-else>
            <label>
              Nom :
              <input v-model="editForm.name_game" />
            </label>
            <label>
              Année :
              <input type="number" v-model.number="editForm.year_game" />
            </label>
            <label>
              URL Image :
              <input v-model="editForm.thumbnail" />
            </label>
            <label>
              URL Site :
              <input v-model="editForm.url" />
            </label>
            <button @click="submitEdit(game.id_game)">Enregistrer</button>
            <button @click="cancelEditing">Annuler</button>
          </div>
        </div>
      </div>
  
      <p v-else>Aucun jeu trouvé.</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'DashboardGames',
    data() {
      return {
        games: [],
        loading: false,
        errorMessage: '',
        editingGameId: null,
        editForm: {
          name_game: '',
          year_game: 0,
          thumbnail: '',
          url: '',
        },
      };
    },
    created() {
      // Vérifier le rôle admin (localStorage)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id_user || user.role_user !== 'admin') {
        this.$router.push('/');
        return;
      }
      this.fetchGames();
    },
    methods: {
      async fetchGames() {
        this.loading = true;
        this.errorMessage = '';
        try {
          const res = await axios.get('http://localhost:3000/games');
          this.games = res.data;
        } catch (err) {
          this.errorMessage = "Erreur lors du chargement des jeux";
          console.error(err);
        } finally {
          this.loading = false;
        }
      },
      startEditing(game) {
        this.editingGameId = game.id_game;
        this.editForm = {
          name_game: game.name_game,
          year_game: game.year_game,
          thumbnail: game.thumbnail,
          url: game.url,
        };
      },
      cancelEditing() {
        this.editingGameId = null;
      },
      async submitEdit(gameId) {
        try {
          await axios.put(`http://localhost:3000/games/${gameId}`, this.editForm);
          alert('Jeu modifié avec succès');
          this.editingGameId = null;
          await this.fetchGames();
        } catch (err) {
          console.error('Erreur modification jeu:', err);
          alert('Erreur lors de la modification');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .dashboard-games {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 1rem;
  }
  
  .games-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .game-card {
    border: 1px solid #ccc;
    padding: 1rem;
    width: 230px;
    border-radius: 5px;
    background: #f7f7f7;
    box-sizing: border-box;
  }
  
  .game-card img.thumbnail {
    width: 100%;
    height: 130px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }
  
  .game-card label {
    display: block;
    margin-bottom: 0.4rem;
  }
  
  .game-card input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.3rem;
    margin-top: 0.1rem;
    margin-bottom: 0.6rem;
  }
  
  .game-card button {
    margin-right: 0.5rem;
    padding: 0.4rem 0.8rem;
  }
  .error {
    color: red;
    margin-bottom: 1rem;
  }
  </style>
  