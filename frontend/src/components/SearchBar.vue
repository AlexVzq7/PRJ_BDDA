<template>
  <div class="search-container">
    <input
      type="text"
      v-model="search"
      @focus="showResults = true"
      @blur="onBlur"
      placeholder="Rechercher un jeu vidéo..."
      class="search-bar"
    />
    <ul v-if="showResults && limitedGames.length" class="results-list">
      <li
        v-for="game in limitedGames"
        :key="game.id"
        class="result-item"
        @click.prevent="goToGame(game)"
      >
        <img :src="game.thumbnail" :alt="game.name" class="thumbnail" />
        <div class="info">
          <span class="game-title">{{ game.name }}</span>
          <span class="game-year" v-if="game.year">({{ game.year }})</span>
        </div>
      </li>
    </ul>

    <div v-if="showResults && search && !limitedGames.length" class="no-result">
      Aucun jeu trouvé.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const games = ref([])
const search = ref('')
const showResults = ref(false)
const router = useRouter()

// Charger initialement tous les jeux (optionnel)
onMounted(async () => {
  const res = await axios.get('http://localhost:3000/api/games')
  games.value = res.data
})

// Quand la recherche change, on interroge l'API
watch(search, async (newVal) => {
  if (!newVal) {
    // Si champ vide, on recharge la liste complète (optionnel)
    const res = await axios.get('http://localhost:3000/api/games')
    games.value = res.data
  } else {
    // Recherche côté backend avec la procédure stockée
    try {
      const res = await axios.get('http://localhost:3000/api/search', { params: { q: newVal } })
      games.value = res.data
    } catch (error) {
      console.error('Erreur recherche jeux :', error)
      games.value = []
    }
  }
})

// Limiter à 5 résultats affichés
const limitedGames = computed(() => games.value.slice(0, 5))

function onBlur() {
  // On attend un peu avant de cacher la liste pour laisser passer le click
  setTimeout(() => {
    showResults.value = false
  }, 200)
}

function goToGame(game) {
  if (game && typeof game.id !== 'undefined' && game.id !== null) {
    router.push(`/game/${game.id}`).then(() => {
      window.location.reload();
    });
  } else {
    alert('ID de jeu invalide, impossible de naviguer.');
    console.error('ID de jeu invalide', game);
  }
}

</script>

<style scoped>
.search-container {
  width: 100%;
  margin: 30px 0;
  position: relative;
  z-index: 1000;
}
.search-bar {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #bbb;
  font-size: 16px;
  box-sizing: border-box;
}
.results-list {
  position: absolute;
  top: 44px;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  padding: 0;
  margin: 0;
}
.result-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background 0.2s;
  list-style: none;
}
.result-item:hover {
  background: #f5f5f5;
}
.thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  margin-right: 12px;
  background: #eee;
}
.info {
  display: flex;
  flex-direction: column;
}
.game-title {
  font-weight: 600;
  font-size: 15px;
}
.game-year {
  color: #888;
  font-size: 13px;
}
.no-result {
  position: absolute;
  top: 44px;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0 0 8px 8px;
  padding: 10px;
  color: #888;
  z-index: 10;
}
</style>
