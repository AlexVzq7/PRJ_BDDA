<template>
    <div>
      <h1>Bienvenue sur la page d’accueil</h1>
      
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
        games: []
      }
    },
    mounted() {
      api.getGames()
        .then(response => {
            // Suppose que chaque ligne du backend contient les champs :
            // nom, image_url, joueurs_min, joueurs_max
            console.log(response.data);
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
    }
  }
  </script>


<style>
.section {
  display: flex;
}
</style>