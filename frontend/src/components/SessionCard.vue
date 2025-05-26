<template>
    <div class="session-card">
      <!-- Badge temps -->
      <div class="absolute top-2 right-2 bg-gray-700 text-white text-sm px-3 py-1 rounded-full">
        Dans {{ session.startsIn }} heures
      </div>
  
      <!-- Avatar principal avec score -->
      <div>
        <div class="relative w-20 h-20">
          <img src="https://via.placeholder.com/80" alt="avatar" class="rounded-full w-full h-full" />
          <div class="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
            {{ session.ownerScore }}
          </div>
        </div>
      </div>
  
      <!-- Informations de la session -->
      <h2 class="text-lg font-semibold text-center mb-1">Partie de {{ session.ownerName }}</h2>
      <p class="text-sm text-gray-600 text-center">{{ session.location }}</p>
      <p class="text-sm text-gray-500 text-center mb-3">{{ session.slotsRemaining }} places restantes</p>
  
      <!-- Participants -->
      <div class="flex justify-center gap-2 mb-4">
        <div
          v-for="(participant, index) in session.participants"
          :key="index"
          class="relative w-8 h-8"
        >
          <img src="https://via.placeholder.com/32" alt="participant" class="rounded-full w-full h-full" />
          <div
            class="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full"
            :class="{
              'bg-green-500': participant.score >= 70,
              'bg-yellow-500': participant.score >= 30 && participant.score < 70,
              'bg-red-500': participant.score < 30
            }"
          >
            {{ participant.score }}
          </div>
        </div>
      </div>
  
      <!-- Bouton -->
      <button class="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800">
        Rejoindre la session
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SessionCard',
    props: {
      session: {
        type: Object,
        required: true,
        default: () => ({
          ownerName: 'Lucas',
          ownerScore: 70,
          location: 'Paris 12ème Arrondissement',
          slotsRemaining: 5,
          startsIn: 12,
          participants: [
            { score: 100 },
            { score: 80 },
            { score: 10 }
          ]
        })
      }
    }
  }
  </script>
  
  <style scoped>
  /* Ajoute du style personnalisé ici si besoin */
.session-card{
  border: 1px solid grey;
  max-width: 300px;
}
  </style>
  