<template>
  <div>
    <h2>Gestion des utilisateurs</h2>

    <table border="1" cellpadding="10">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Email</th>
          <th>Rôle</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id_user">
          <td>{{ user.id_user }}</td>
          <td>{{ user.name_user }}</td>
          <td>{{ user.email_user }}</td>
          <td>{{ user.role_user }}</td>
          <td>
            <button @click="deleteUser(user.id_user)">🗑 Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="users.length === 0" style="margin-top: 20px;">Aucun utilisateur à afficher.</p>
  </div>
</template>

<script>
export default {
  name: 'AdminUserList',
  data() {
    return {
      users: []
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      fetch('http://localhost:3000/user')
        .then(res => res.json())
        .then(data => {
          this.users = data;
          console.log("Utilisateurs chargés :", data);
        })
        .catch(err => console.error("Erreur chargement users :", err));
    },
    deleteUser(id) {
      if (confirm("Supprimer cet utilisateur ?")) {
        fetch(`http://localhost:3000/admin/user/${id}?admin=1`, {
          method: 'DELETE'
        })
          .then(async res => {
            const data = await res.json();
            if (!res.ok) {
              console.error("Réponse serveur : ", data);
              alert("Erreur lors de la suppression : " + data.message);
              return;
            }
            alert(data.message);
            this.users = this.users.filter(u => u.id_user !== id);
          })
          .catch(err => {
            console.error("Erreur réseau/fetch :", err);
            alert("Erreur lors de la suppression (fetch)");
          });
      }
    }
  }
};
</script>
