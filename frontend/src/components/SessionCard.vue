<template>
  <div class="session-card">
    <!-- Badge temps -->
    <div class="absolute top-2 right-2 bg-gray-700 text-white text-sm px-3 py-1 rounded-full">
      Dans {{ startsIn }} heures
    </div>

    <!-- Hôte -->
    <div class="top mb-4">
      <div class="relative w-20 h-20 inline-block">
        <img src="https://via.placeholder.com/80" alt="avatar hôte" class="rounded-full" />
        <div
          class="absolute top-0 right-0 text-white text-xs px-2 py-0.5 rounded-full"
          :class="hostScoreColor"
        >
          {{ session.host_score }}
        </div>
      </div>
      <h2 class="text-lg font-semibold inline-block align-middle ml-3">
        Partie de {{ session.host_name }}
      </h2>
    </div>

    <!-- Infos session -->
    <p class="text-sm text-gray-600 text-center">{{ session.location || 'Lieu non renseigné' }}</p>
    <p class="text-sm text-gray-500 text-center mb-4">
      {{ slotsRemaining }} places restantes
    </p>

    <!-- Participants -->
    <div class="flex justify-center gap-2 mb-4">
      <div
        v-for="p in session.participants"
        :key="p.id_user"
        class="participant w-12 h-12"
        :title="p.name_user"
      >
        <img src="https://via.placeholder.com/32" class="rounded-full w-full h-full" />
        <div
          class="absolute -top-2 -right-2 text-white text-[10px] px-1.5 py-0.5 rounded-full"
          :class="participantScoreColor(p.trust_score)"
        >
          <p>{{ p.name_user }} - {{ p.trust_score }}% de confiance</p>
        </div>
      </div>
    </div>

    <!-- Bouton rejoindre / quitter -->
    <div class="text-center">
      <button
        v-if="!isParticipant"
        @click="joinSession"
        :disabled="loading"
        class="btn-rejoindre"
      >
        Rejoindre
      </button>
      <button
        v-else
        @click="leaveSession"
        :disabled="loading"
        class="btn-quitter"
      >
        Quitter
      </button>
    </div>

    <!-- Messages -->
    <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
    <p v-if="successMessage" class="text-green-500 text-sm mt-2">{{ successMessage }}</p>
  </div>
</template>

<script>
import api from '../api.js';

export default {
  name: 'SessionCard',
  props: {
    session: { type: Object, required: true }
  },
  data() {
    return {
      loading: false,
      errorMessage: '',
      successMessage: ''
    };
  },
  computed: {
    slotsRemaining() {
      return this.session.max_players - (this.session.participants?.length || 0);
    },
    startsIn() {
      const now = new Date(), start = new Date(this.session.starting_date);
      return Math.max(0, Math.round((start - now) / 36e5));
    },
    hostScoreColor() {
      const s = this.session.host_score || 0;
      return s >= 70 ? 'bg-green-500' : s >= 30 ? 'bg-yellow-500' : 'bg-red-500';
    },
    isParticipant() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return this.session.participants.some(p => p.id_user === user.id_user);
    }
  },
  methods: {
    participantScoreColor(score) {
      return score >= 70 ? 'bg-green-500' : score >= 30 ? 'bg-yellow-500' : 'bg-red-500';
    },
    async joinSession() {
      this.errorMessage = '';
      this.successMessage = '';
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id_user) {
        this.errorMessage = 'Connectez-vous d’abord.';
        return;
      }
      if (this.slotsRemaining <= 0) {
        this.errorMessage = 'Session pleine.';
        return;
      }
      this.loading = true;
      try {
        await api.joinSession(this.session.id_session, user.id_user);
        this.successMessage = 'Vous avez rejoint !';
        // reload page dans 2s
        setTimeout(() => window.location.reload(), 2000);
      } catch (e) {
        this.errorMessage = e.response?.data?.error || 'Erreur.';
      } finally {
        this.loading = false;
      }
    },
    async leaveSession() {
      this.errorMessage = '';
      this.successMessage = '';
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.loading = true;
      try {
        await api.leaveSession(this.session.id_session, user.id_user);
        this.successMessage = 'Vous avez quitté.';
        // reload page dans 2s
        setTimeout(() => window.location.reload(), 2000);
      } catch (e) {
        this.errorMessage = e.response?.data?.error || 'Erreur.';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.session-card {
  border: 1px solid grey;
  max-width: 300px;
  position: relative;
  padding: 1rem;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.top {
  display: flex;
  align-items: center;
}
.participant {
  display: flex;
  align-items: center;
}
.participant img {
  margin-right: 10px;
}

.btn-rejoindre {
  background-color: rgb(0, 183, 255);
  padding: 5px;
  font-family: 15px;
  cursor: pointer;
  border: 1px solid grey;
  border-radius: 8px;
}

.btn-quitter {
  background-color: rgb(255, 52, 52);
  padding: 5px;
  font-family: 15px;
  cursor: pointer;
  border: 1px solid grey;
  border-radius: 8px;
}
</style>
