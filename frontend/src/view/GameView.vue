<template>
  <div v-if="game">
    <div class="head-game">
      <img :src="game.image" alt="cover" class="background" />
      <div class="background-2"></div>
      <div class="fade"></div>
      <div class="left-part">
        <h1 class="text-3xl font-bold mb-2">{{ game.name }}</h1>

        <!-- Image + bouton vers site officiel -->
        <div class="mb-4 flex items-center gap-4">
          <a
            v-if="game.website"
            :href="game.website"
            target="_blank"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Site officiel
          </a>
        </div>

        <!-- Infos générales -->
        <p class="mb-2">📅 Sortie : {{ formatDate(game.release_date) }}</p>
        <p class="mb-2">⭐ Classement : {{ game.rank }} / 5</p>
        <p class="mb-4">🗳️ Total des notes : {{ game.totalRatings }}</p>

        <!-- Catégories -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="cat in game.categories"
            :key="cat"
            class="px-2 py-1 bg-gray-200 rounded-full text-sm"
            >{{ cat }}</span
          >
        </div>

        <!-- Description & éditeur -->
        <div class="prose mb-6">
          <p v-if="game.description">{{ game.description }}</p>
          <p v-else class="italic text-gray-500">
            Pas de description disponible.
          </p>
          <p class="mt-2 text-sm">
            Éditeur : <strong>{{ game.publisher || "Inconnu" }}</strong>
          </p>
        </div>
        <button @click="goToCreateSession" class="btn-create-session">
          🎲 Créer une session pour ce jeu
        </button>
      </div>
      <div class="right-part">
        <img
          :src="game.image"
          alt="cover"
          class="w-48 h-auto rounded-lg shadow"
        />
      </div>
    </div>

    <!-- Sessions associées (comme avant) -->
    <div class="session-container">
      <SessionCard
        v-for="session in sessions"
        :key="session.id_session"
        :session="session"
      />
    </div>
  </div>

  <div v-else class="p-6">
    <p>Chargement du jeu…</p>
  </div>
</template>

<script>
import api from "../api.js";
import SessionCard from "../components/SessionCard.vue";

export default {
  name: "GameView",
  components: { SessionCard },
  data() {
    return {
      game: null,
      sessions: [],
    };
  },
  mounted() {
    const id = this.$route.params.id;

    // 1) Chargement du jeu enrichi
    api
      .getGameById(id)
      .then((res) => {
        const d = res.data;
        this.game = {
          id: d.id_game,
          name: d.name_game,
          image: d.image_url,
          website: d.website,
          release_date: d.release_date,
          is_available: d.is_available,
          rank: d.rank_game,
          totalRatings: d.total_ratings,
          description: d.description,
          publisher: d.publisher,
          categories: d.categories ? d.categories.split(",") : [],
        };
      })
      .catch((err) => console.error("Erreur chargement jeu :", err));

    // 2) Sessions comme avant
    api
      .getSessionsByGameId(id)
      .then((res) => {
        this.sessions = res.data;
      })
      .catch((err) => console.error("Erreur chargement sessions :", err));
  },
  methods: {
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString();
    },
    goToCreateSession() {
      this.$router.push({
        path: "/create-session",
        query: { jeu_id: this.game.id },
      });
    },
  },
};
</script>

<style scoped>
.session-container {
  display: flex;
  gap: 1rem;
  margin-top: 30px;
}
.prose p {
  margin: 0.5rem 0;
}
.head-game {
  height: 300px;
  width: 100%;
  background-color: #15151500;

  display: flex;
  padding: 25px;
  border-radius: 25px;
  position: relative;
  /* z-index: -2;  ❌ Supprime ce z-index */
  overflow: hidden;
  color: white;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1; /* L'image est derrière */
  opacity: 1;
}
.background-2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(
    21,
    21,
    21,
    0.9
  ); /* Couleur de fond semi-transparente */
  z-index: -5; /* Assure que le fond passe derrière les autres éléments */
}
.fade {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(21, 21, 21, 1) 0%,
    rgba(21, 21, 21, 0.5) 50%,
    rgba(21, 21, 21, 1) 100%
  );
  z-index: -1; /* Assure que le dégradé passe derrière les autres éléments */
}

.head-game .left-part,
.head-game .right-part {
  position: relative; /* Permet au z-index de s'appliquer */
  z-index: 1; /* Assure qu'ils passent devant l'image */
}

.head-game .left-part {
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
}

.head-game .right-part {
  height: 100%;
  width: 50%;
}

.head-game .right-part img {
  height: 100%;
}

.btn-create-session {
  width: 290px;
  height: 50px;
  background-color: #303030;
  border: 1px solid gray;
  border-radius: 15px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  z-index: 1000;
}
.btn-create-session:hover {
  background-color: #4b4b4b;
}
</style>
