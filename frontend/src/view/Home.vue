<template>
  <div class="homeview">
    <div class="header">
      <h1>Bienvenue sur la page d’accueil</h1>
    </div>

    <!-- Filtre catégorie -->
    <div class="my-4">
      <label for="category-select">Filtrer par catégorie :</label>
      <select
        id="category-select"
        v-model="selectedCategory"
        @change="loadGamesByCategory"
      >
        <option value="">-- Tous les jeux --</option>
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
  border: 1px solid black;
}
.my-4 {
  margin: 1rem 0;
}
</style>
