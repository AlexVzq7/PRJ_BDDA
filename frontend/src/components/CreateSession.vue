<template>
  <div class="form-container">
    <h2>Créer une session</h2>
    <form @submit.prevent="submitSession">
      <label>Min joueurs</label>
      <input
        type="number"
        v-model="form.min_joueurs"
        placeholder="Min joueurs"
        required
      />

      <label>Max joueurs</label>
      <input
        type="number"
        v-model="form.max_joueurs"
        placeholder="Max joueurs"
        required
      />

      <label>Temps de jeu</label>
      <input type="time" v-model="form.temps_jeu" required />

      <label>Durée minimum</label>
      <input type="time" v-model="form.min_duree" required />

      <label>Durée maximum</label>
      <input type="time" v-model="form.max_duree" required />

      <label>Âge minimum</label>
      <input
        type="number"
        v-model="form.age_min"
        placeholder="Âge minimum"
        required
      />

      <label>ID du jeu</label>
      <input
        type="number"
        v-model="form.jeu_id"
        placeholder="ID du jeu"
        required
      />

      <label>Date de début</label>
      <input type="datetime-local" v-model="form.date_debut" required />

      <button type="submit">Créer la session</button>
    </form>

    <div v-if="message" style="margin-top: 1em; color: green">
      {{ message }}
    </div>
    <div v-if="erreur" style="margin-top: 1em; color: red">{{ erreur }}</div>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      form: {
        min_joueurs: 2,
        max_joueurs: 4,
        temps_jeu: "",
        min_duree: "",
        max_duree: "",
        age_min: 10,
        jeu_id: "",
        date_debut: "",
        id_host: null, // Ne sera plus saisi manuellement
      },
      message: "",
      erreur: "",
    };
  },
  mounted() {
    // Récupération des informations utilisateur depuis le localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      this.form.id_host = user.id_user;
    } else {
      this.erreur = "Utilisateur non connecté";
    }
  },
  methods: {
    async submitSession() {
      console.log("HAHA");
      try {
        // Vérification que l'ID host est bien présent
        if (!this.form.id_host) {
          throw new Error("Utilisateur non identifié");
        }

        console.log(this.form);

        const response = await api.createSession(this.form);
        this.message = response.data.message;
        this.erreur = "";
      } catch (err) {
        this.erreur =
          err.response?.data?.error || err.message || "Erreur inattendue";
        this.message = "";
      }
    },
  },
};
</script>

<style>
.form-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 25px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fafafa;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-container form {
  display: flex;
  flex-direction: column;
}

.form-container input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #bbb;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-container input:focus {
  border-color: #3e5c76;
  outline: none;
}

.form-container button {
  padding: 12px;
  background-color: #3e5c76;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.form-container button:hover {
  background-color: #5e7d98;
}

.form-container div[style*="color: green"] {
  text-align: center;
  font-weight: bold;
}

.form-container div[style*="color: red"] {
  text-align: center;
  font-weight: bold;
}
</style>
