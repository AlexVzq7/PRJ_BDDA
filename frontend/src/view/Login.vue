<template>
  <h1>Connexion</h1>
  <form @submit.prevent="loginAction">
    <input v-model="email" type="email" required placeholder="email"/>
    <input v-model="password" type="password" required placeholder="password"/>
    <button type="submit">Se connecter</button>
    <div v-if="errorMessage">{{ errorMessage }}</div>
  </form>

  <a @click="$router.push('/register')">Pas encore de compte ? Creez-vous en un.</a>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async loginAction() {
      try {
        const res = await axios.post('http://localhost:3000/login', {
          email: this.email,
          password: this.password
        });
        console.log('Connexion réussie', res.data);

        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));

          // Rediriger selon le rôle
          if (res.data.user.role_user === 'admin') {
            this.$router.push('/dashboard').then(() => {
      window.location.reload();
    });
          } else {
            this.$router.push('/').then(() => {
      window.location.reload();
    });
          }
        }
      } catch (err) {
        this.errorMessage = "Échec de la connexion";
        console.error('Erreur:', err);
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