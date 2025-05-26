<template>
  <div>
    <div class="header">
      <h1>Bienvenue sur la page d’accueil</h1>

      <!-- Partie conditionnelle selon connexion -->
      <div>
        <template v-if="user">
          <div>
            Connecté en tant que : <strong>{{ user.name_user }}</strong>
            <button @click="logout">Déconnexion</button>
          </div>
        </template>
        <template v-else>
          <button @click="$router.push('/login')">Se connecter</button>
          <button @click="$router.push('/register')">S'inscrire</button>
        </template>
      </div>
    </div>

    <div class="section">
      <GameCard
        v-for="(game, index) in games"
        :key="index"
        :game="game"
      />
    </div>
  </div>
</template>

<script>
import api from '../api.js'
import GameCard from '../components/GameCard.vue'

export default {
  name: 'Home',
  components: { GameCard },
  data() {
    return {
      games: [],
      user: null
    }
  },
  mounted() {
    // Charger les jeux
    api.getGames()
      .then(response => {
        this.games = response.data.map(item => ({
          id: item.id_game,
          name: item.name_game,
          image: item.thumbnail || 'https://via.placeholder.com/300x200',
          minPlayers: item.joueurs_min || 1,
          maxPlayers: item.joueurs_max || 9
        }))
      })
      .catch(error => {
        console.error('Erreur lors du chargement des jeux :', error)
      })

    // Vérifier si utilisateur connecté dans localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser)
      } catch(e) {
        console.error('Erreur lecture utilisateur dans localStorage', e)
      }
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('user')
      this.user = null
      // Option 1 : redirection vers login
      this.$router.push('/login')

      // Option 2 : ou recharge la page
      // window.location.reload()
    }
  }
}
</script>

<style>
.section {
  display: flex;
  gap: 1rem;
}
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid black;
}
</style>