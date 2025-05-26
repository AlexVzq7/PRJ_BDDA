<template>
  <div id="app">
    <div class="header-app">
      <a @click="$router.push('/')">Dos</a>
      <SearchBar />
      <div>
          <template v-if="user">
            <div>
              Connecté en tant que : <strong>{{ user.name_user }}</strong>
              <button @click="logout">Déconnexion</button>
            </div>
          </template>
          <template v-else>
            <button @click="$router.push('/login')">Se connecter</button>
            <button @click="$router.push('/register')">S'inscrire</button>
          </template>
        </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue'

export default {
  name: 'App',
  components: {
    SearchBar
  },
  data() {
    return {
      user: null
    }
  },
  mounted() {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser)
      } catch(e) {
        console.error('Erreur lecture utilisateur dans localStorage', e)
      }
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('user')
      this.user = null
      this.$router.push('/login')
    }
  }
}
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

* {
  font-family: 'Inter', sans-serif;
  padding: 0;
  margin: 0;
}
body {
  background-color: #f5f5f5;
}

.header-app {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5vw;
}
.header-app a {
  font-size: 35px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
}
.header-app a:hover {
  transform: translateY(-2px);
}
</style>
