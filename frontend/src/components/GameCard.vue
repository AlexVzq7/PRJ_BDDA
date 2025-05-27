<template>
  <div class="gameCard">
    <div class="relative">
      <div class="img-container">
        <img
          :src="game.image"
          alt="Image du jeu"
          class="w-full h-44 object-cover"
        />
      </div>
    </div>
    <div class="p-4">
      <h2 class="text-lg font-semibold">{{ game.name }}</h2>
      <p class="text-sm text-gray-600">
        de {{ game.minPlayers }} à {{ game.maxPlayers }} joueurs
      </p>
    </div>
    <router-link :to="`/game/${game.id}`" class="link-game"
      >Trouver une session</router-link
    >
  </div>
</template>

<script>
export default {
  name: "GameCard",
  props: {
    game: {
      type: Object,
      required: true,
      default: () => ({
        name: "Nom du jeu",
        image: "https://via.placeholder.com/300x200",
        minPlayers: 2,
        maxPlayers: 4,
      }),
    },
  },
};
</script>

<style scoped>
/* Tu peux ajouter du style custom ici si nécessaire */
.gameCard {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid grey;
  border-radius: 15px;
  margin-left: 20px;
  min-height: 250px;
  width: 200px;
  background-color: white;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.relative {
  width: 100%;
  height: 50%;
}

.img-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
  background-color: rgb(135, 135, 135);
  overflow: hidden;
}
.img-container img {
  width: 100%;
  height: 100%;
}

.p-4 {
  width: 100%;
  min-height: 50%;
  padding: 15px;
  padding-bottom: 0;
}

.p-4 h2 {
  font-size: 22px;
  font-weight: 400;
}
.p-4 p {
  font-size: 13px;
  font-weight: 300;
}

.link-game {
  position: absolute;
  bottom: 10px;
  right: 14px;
  background-color: #3e5c76;
  text-decoration: none;
  color: white;
  padding: 9px 10px;
  border-radius: 9px;
}
</style>
