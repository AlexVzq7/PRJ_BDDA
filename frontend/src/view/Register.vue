<template>
  <h1>S'inscrire</h1>
  <form @submit.prevent="register">
    <input v-model="username" placeholder="Username" required />
    <input v-model="email" placeholder="Email" required />
    <input v-model="password" placeholder="Mot de passe" required type="password" />
    <button type="submit">Créer un compte</button>
    <div v-if="message">{{ message }}</div>
  </form>
  <a @click="$router.push('/login')">Déjà un compte ? Connectez-vous.</a>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Register',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      message: ''
    };
  },
  methods: {
    async register() {
      try {
        const res = await axios.post('http://localhost:3000/register', {
          username: this.username,
          email: this.email,
          password: this.password
        });

        // Affiche le message de succès personnalisé
        this.message = "Utilisateur créé avec succès";

        // Attendre 3 secondes puis rediriger vers /login
        setTimeout(() => {
          this.$router.push('/login');
        }, 3000);

      } catch (err) {
        this.message = err.response?.data?.error || "Erreur";
      }
    }
  }
};
</script>


<style scoped>
a {
  cursor: pointer;
  text-decoration: underline;
  color: blue;
}
</style>