<template>
  <div class="homeview">
    <div class="header">
      <h1>
        Rencontrez des milliers de joueurs <br />autour de jeux de sociétés
      </h1>
      <h2>+1500 sessions en cours</h2>
    </div>

    <!-- Filtre catégorie -->
    <div class="my-4">
      <label for="category-select">Filtres </label>
      <select
        id="category-select"
        v-model="selectedCategory"
        @change="loadGamesByCategory"
      >
        <option value="">Tous les jeux</option>
        <option
          v-for="cat in categories"
          :key="cat.id_category"
          :value="cat.id_category"
        >
          {{ cat.type_category }}
        </option>
      </select>
    </div>

    <div class="section">
      <GameCard v-for="(game, index) in games" :key="index" :game="game" />
    </div>
  </div>
</template>

<script>
import api from "../api.js";
import GameCard from "../components/GameCard.vue";

export default {
  name: "Home",
  components: { GameCard },
  data() {
    return {
      games: [],
      categories: [],
      selectedCategory: "",
      user: null,
    };
  },
  mounted() {
    this.loadCategories();
    this.loadGames();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (e) {
        console.error("Erreur lecture utilisateur dans localStorage", e);
      }
    }
  },
  methods: {
    loadCategories() {
      api
        .getCategories()
        .then((res) => {
          this.categories = res.data;
        })
        .catch((err) => {
          console.error("Erreur chargement catégories :", err);
        });
    },
    loadGames() {
      api
        .getGames()
        .then((res) => {
          this.games = res.data.map((item) => ({
            id: item.id_game,
            name: item.name_game,
            image: item.thumbnail || "https://via.placeholder.com/300x200",
            minPlayers: item.joueurs_min || 1,
            maxPlayers: item.joueurs_max || 9,
          }));
        })
        .catch((err) => {
          console.error("Erreur chargement jeux :", err);
        });
    },
    loadGamesByCategory() {
      if (!this.selectedCategory) {
        // Si aucune catégorie sélectionnée, charger tous les jeux
        this.loadGames();
        return;
      }
      api
        .getGamesByCategory(this.selectedCategory)
        .then((res) => {
          this.games = res.data.map((item) => ({
            id: item.id_game,
            name: item.name_game,
            image: item.thumbnail || "https://via.placeholder.com/300x200",
            minPlayers: item.joueurs_min || 1,
            maxPlayers: item.joueurs_max || 9,
          }));
        })
        .catch((err) => {
          console.error("Erreur chargement jeux par catégorie :", err);
        });
    },
    logout() {
      localStorage.removeItem("user");
      this.user = null;
      this.$router.push("/login");
    },
  },
};
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin: 25px;
}

.header h1 {
  text-align: center;
}
h1 {
  font-size: 45px;
}
.header h2 {
  font-size: 48px;
  font-weight: bold;
  padding: 12px 36px;
  border: none;
  background: linear-gradient(90deg, #9d95d3 0%, #16162c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: 0.3s;
}

.homeview {
  min-height: 100vh;
}
.section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.my-4 {
  margin: 1rem 0;
}

/* Style général du bloc de filtre */
.my-4 {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Label du filtre */
.my-4 label {
  font-weight: bold;
  color: #333;
}

/* Select stylisé */
.my-4 select {
  padding: 7px 8px;
  border: 1px solid #bbb;
  border-radius: 25px;
  font-size: 14px;
  background-color: #fff;
  transition: border-color 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.my-4 select:focus {
  border-color: #3e5c76;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
  outline: none;
}

/* Option spéciale pour "-- Tous les jeux --" */
.my-4 select option:first-child {
  font-style: italic;
  color: #777;
}
</style>
