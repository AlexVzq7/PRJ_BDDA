<template>
    <form @submit.prevent="loginAction">
      <input v-model="email" type="email" required />
      <input v-model="password" type="password" required />
      <button type="submit">Se connecter</button>
      <div v-if="errorMessage">{{ errorMessage }}</div>
    </form>
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
          
          console.log(res.data);
          // Rediriger après connexion
          //this.$router.push('/');
        } catch (err) {
          this.errorMessage = "Échec de la connexion";
          console.error('Erreur:', err);
        }
      }
    }
  };
  </script>
  