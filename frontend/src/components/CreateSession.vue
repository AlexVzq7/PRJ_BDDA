<template>
  <div class="form-container">
    <h2>Créer une session h</h2>
    <form @submit.prevent="submitSession">
      <input type="number" v-model="form.min_joueurs" placeholder="Min joueurs" required />
      <input type="number" v-model="form.max_joueurs" placeholder="Max joueurs" required />
      <input type="time" v-model="form.temps_jeu" required />
      <input type="time" v-model="form.min_duree" required />
      <input type="time" v-model="form.max_duree" required />
      <input type="number" v-model="form.age_min" placeholder="Âge minimum" required />
      <input type="number" v-model="form.jeu_id" placeholder="ID du jeu" required />
      <input type="datetime-local" v-model="form.date_debut" required />

      <button type="submit">Créer la session</button>
    </form>

    <div v-if="message" style="margin-top: 1em; color: green;">{{ message }}</div>
    <div v-if="erreur" style="margin-top: 1em; color: red;">{{ erreur }}</div>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      form: {
        min_joueurs: 2,
        max_joueurs: 4,
        temps_jeu: '',
        min_duree: '',
        max_duree: '',
        age_min: 10,
        jeu_id: '',
        date_debut: '',
        id_host: null // Ne sera plus saisi manuellement
      },
      message: '',
      erreur: ''
    };
  },
  mounted() {
    // Récupération des informations utilisateur depuis le localStorage
    const userData = localStorage.getItem('user');
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
        this.erreur = '';
      } catch (err) {
        this.erreur = err.response?.data?.error || err.message || "Erreur inattendue";
        this.message = '';
      }
    }
  }
};
</script>
