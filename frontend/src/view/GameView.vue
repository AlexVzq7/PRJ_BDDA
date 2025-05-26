<template>
<div v-if="game">
    <h1 class="text-2xl font-bold mb-4">{{ game.name }}</h1>
    <img :src="game.image" alt="image du jeu" />
    <p>Nombre de joueurs : {{ game.minPlayers }} à {{ game.maxPlayers }}</p>

    <div class="session-container">
        <SessionCard/>
    </div>
    

</div>

<div v-else class="p-6">
    <p>Chargement du jeu...</p>
</div>
</template>
  
  
<script>
import api from '../api.js';
import SessionCard from '../components/SessionCard.vue';


export default {
    name: 'GameView',
    components: {
        SessionCard
    },
    data() {
      return {
        game: null
      }
    },
    mounted() {
        const id = this.$route.params.id
        api.getGameById(id).then(res => {
                            this.game = {
                                id: res.data.id_game,
                                name: res.data.name_game || "Jeux",
                                image: res.data.image_url || 'https://thumbs.dreamstime.com/b/jeux-de-soci%C3%A9t%C3%A9-32330418.jpg',
                                minPlayers: res.data.joueurs_min || 1,
                                maxPlayers: res.data.joueurs_max || 10
                            }
                        }).catch(err => {
                            console.error('Erreur lors du chargement du jeu :', err)
                        });
        api.getSessionsByGameId(id).then(res => {
            console.log(res.data);
        })     
    }
  }
  </script>
  