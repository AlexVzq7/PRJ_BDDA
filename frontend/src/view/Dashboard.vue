<template>
    <div class="dashboard">
      <h1>Dashboard Admin - Gestion des utilisateurs</h1>
  
      <table v-if="users.length" class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Ville</th>
            <th>Score Confiance</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id_user">
            <td>{{ user.id_user }}</td>
            <td>{{ user.name_user }}</td>
            <td>{{ user.email_user }}</td>
            <td>{{ user.role_user }}</td>
            <td>{{ user.city_user }}</td>
            <td>{{ user.trust_score }}</td>
          </tr>
        </tbody>
      </table>
  
      <p v-else>Aucun utilisateur trouvé.</p>

      <button @click="$router.push('/dashboard-games')">Modifier les jeux</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Dashboard',
    data() {
      return {
        users: [],
        loading: false,
        errorMessage: ''
      };
    },
    created() {
      // Vérifier que l'utilisateur est admin
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id_user || user.role_user !== 'admin') {
        this.$router.push('/'); // rediriger si pas admin
        return;
      }
  
      this.fetchUsers();
    },
    methods: {
      async fetchUsers() {
        this.loading = true;
        this.errorMessage = '';
        try {
          const res = await axios.get('http://localhost:3000/admin/users');
          this.users = res.data;
        } catch (err) {
          this.errorMessage = 'Erreur lors du chargement des utilisateurs';
          console.error(err);
        } finally {
          this.loading = false;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .dashboard {
    max-width: 900px;
    margin: 2rem auto;
    padding: 1rem;
  }
  
  .users-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .users-table th,
  .users-table td {
    border: 1px solid #ccc;
    padding: 0.5rem 1rem;
    text-align: left;
  }
  
  .users-table th {
    background-color: #eee;
  }
  </style>
  