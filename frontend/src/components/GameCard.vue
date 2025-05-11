<template>
<div class="gameCard">
    <div class="relative">
        <img :src="game.image" alt="Image du jeu" class="w-full h-44 object-cover" />
        <button class="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl">
            ♥
        </button>
    </div>
    <div class="p-4">
        <h2 class="text-lg font-semibold">{{ game.name }}</h2>
        <p class="text-sm text-gray-600">de {{ game.minPlayers }} à {{ game.maxPlayers }} joueurs</p>
    </div>
        <router-link :to="`/game/${game.id}`">Trouver une session</router-link>
</div>
</template>

<script>
export default {
name: 'GameCard',
props: {
    game: {
    type: Object,
    required: true,
    default: () => ({
        name: 'Nom du jeu',
        image: 'https://via.placeholder.com/300x200',
        minPlayers: 2,
        maxPlayers: 4
    })
    }
}
}
</script>

<style scoped>
/* Tu peux ajouter du style custom ici si nécessaire */
.gameCard {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid grey;
    border-radius: 15px;
    margin-left: 20px;
    min-height: 200px;
}

</style>
