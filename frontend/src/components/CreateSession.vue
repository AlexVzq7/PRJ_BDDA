<template>
  <div class="form-container">
    <h2>Créer une session</h2>
    <form @submit.prevent="submitSession">
      <input type="number" v-model="form.min_joueurs" placeholder="Min joueurs" required />
      <input type="number" v-model="form.max_joueurs" placeholder="Max joueurs" required />
      <input type="time" v-model="form.temps_jeu" required />
      <input type="time" v-model="form.min_duree" required />
      <input type="time" v-model="form.max_duree" required />
      <input type="number" v-model="form.age_min" placeholder="Âge minimum" required />
      <input type="number" v-model="form.jeu_id" placeholder="ID du jeu" required />
      <input type="datetime-local" v-model="form.date_debut" required />
      <input type="number" v-model="form.id_host" placeholder="Ton ID utilisateur (temporaire)" required />

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
        id_host: '' // ⚠️ Temporairement saisi à la main
      },
      message: '',
      erreur: ''
    };
  },
  methods: {
    async submitSession() {
      try {
        const response = await api.createSession(this.form);
        this.message = response.data.message;
        this.erreur = '';
      } catch (err) {
        this.erreur = err.response?.data?.error || "Erreur inattendue";
        this.message = '';
      }
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input, button {
  padding: 8px;
}
</style>
