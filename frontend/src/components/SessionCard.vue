<template>
  <div class="session-card">
    <!-- Badge temps -->
    <div class="timer">Dans {{ startsIn }} heures</div>

    <!-- Hôte -->
    <div class="top mb-4">
      <div class="relative w-20 h-20 inline-block">
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="avatar hôte"
          class="rounded-full"
        />
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
    <p class="location">
      {{ session.location || "Lieu non renseigné" }}
    </p>
    <p class="remaining">{{ slotsRemaining }} places restantes</p>

    <!-- Participants -->
    <div>
      <div
        v-for="p in session.participants"
        :key="p.id_user"
        class="participant w-12 h-12"
        :title="p.name_user"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          class="rounded-full w-full h-full"
        />
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
    <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
      {{ errorMessage }}
    </p>
    <p v-if="successMessage" class="text-green-500 text-sm mt-2">
      {{ successMessage }}
    </p>
  </div>
</template>

<script>
import api from "../api.js";

export default {
  name: "SessionCard",
  props: {
    session: { type: Object, required: true },
  },
  data() {
    return {
      loading: false,
      errorMessage: "",
      successMessage: "",
    };
  },
  computed: {
    slotsRemaining() {
      return (
        this.session.max_players - (this.session.participants?.length || 0)
      );
    },
    startsIn() {
      const now = new Date(),
        start = new Date(this.session.starting_date);
      return Math.max(0, Math.round((start - now) / 36e5));
    },
    hostScoreColor() {
      const s = this.session.host_score || 0;
      return s >= 70
        ? "bg-green-500"
        : s >= 30
        ? "bg-yellow-500"
        : "bg-red-500";
    },
    isParticipant() {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return this.session.participants.some((p) => p.id_user === user.id_user);
    },
  },
  methods: {
    participantScoreColor(score) {
      return score >= 70
        ? "bg-green-500"
        : score >= 30
        ? "bg-yellow-500"
        : "bg-red-500";
    },
    async joinSession() {
      this.errorMessage = "";
      this.successMessage = "";
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id_user) {
        this.errorMessage = "Connectez-vous d’abord.";
        return;
      }
      if (this.slotsRemaining <= 0) {
        this.errorMessage = "Session pleine.";
        return;
      }
      this.loading = true;
      try {
        await api.joinSession(this.session.id_session, user.id_user);
        this.successMessage = "Vous avez rejoint !";
        // reload page dans 2s
        setTimeout(() => window.location.reload(), 2000);
      } catch (e) {
        this.errorMessage = e.response?.data?.error || "Erreur.";
      } finally {
        this.loading = false;
      }
    },
    async leaveSession() {
      this.errorMessage = "";
      this.successMessage = "";
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      this.loading = true;
      try {
        await api.leaveSession(this.session.id_session, user.id_user);
        this.successMessage = "Vous avez quitté.";
        // reload page dans 2s
        setTimeout(() => window.location.reload(), 2000);
      } catch (e) {
        this.errorMessage = e.response?.data?.error || "Erreur.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.session-card {
  border: 1px solid grey;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  position: relative;
  padding: 1rem;
  height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.top {
  display: flex;
  align-items: center;
}
.top h2 {
  font-weight: 500;
}
.participant {
  display: flex;
}
.participant img {
  margin-right: 10px;
  width: 20px;
  height: 20px;
}
.location {
  margin-top: 10px;
  font-weight: 300;
  font-family: 13px;
}
.remaining {
  margin-bottom: 10px;
  font-weight: 300;
  font-family: 13px;
}

.participant {
  font-size: 14px;
  font-weight: 400;
}
.btn-rejoindre {
  margin-top: 20px;
  background-color: #3e5c76;
  text-decoration: none;
  color: white;
  padding: 9px 10px;
  border-radius: 9px;
  width: 200px;
  border: 1px solid rgb(68, 68, 68);
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-rejoindre:hover {
  background-color: #284660;
}

.btn-quitter {
  background-color: rgb(255, 52, 52);
  padding: 5px;
  font-family: 15px;
  cursor: pointer;
  border: 1px solid grey;
  border-radius: 8px;
}

.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.top img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.timer {
  position: absolute;
  top: -25px;
  right: -20px;
  width: 150px;
  height: 40px;
  background-color: #284660;
  color: white;
  border-radius: 10px;
  border: 1px solid rgb(57, 57, 57);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
