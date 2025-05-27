<template>
  <div id="app">
    <div class="header-app">
      <a @click="$router.push('/')" id="home">Mauvaise pioche</a>
      <div class="search-bar-container"><SearchBar /></div>

      <div>
        <template v-if="user">
          <div>
            <strong class="username">{{ user.name_user }}</strong>
            <button @click="logout" class="btn-deconnexion">Déconnexion</button>
          </div>
        </template>
        <template v-else>
          <button @click="$router.push('/login')" class="btn-connexion">
            Se connecter
          </button>
          <button @click="$router.push('/register')" class="btn-inscription">
            S'inscrire
          </button>
        </template>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBar from "./components/SearchBar.vue";

export default {
  name: "App",
  components: {
    SearchBar,
  },
  data() {
    return {
      user: null,
    };
  },
  mounted() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (e) {
        console.error("Erreur lecture utilisateur dans localStorage", e);
      }
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      this.user = null;
      this.$router.push("/login");
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

* {
  font-family: "Inter", sans-serif;
  padding: 0;
  margin: 0;
}
body {
  background-color: #f5f5f5;
  padding: 0 5vw;
}

#home {
  font-size: 2rem;
  font-weight: bold;
  padding: 12px 36px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #9d95d3 0%, #16162c 100%);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: 0.3s;
  cursor: pointer;
}

.header-app {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 100px;
  z-index: 100;
}

.search-bar-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  width: 400px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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

.btn-inscription,
.btn-connexion,
.btn-deconnexion {
  width: 120px;
  height: 50px;
  border-radius: 100px;
  background-color: #3e5c76;
  color: white;
  font-size: 18px;
  font-weight: 400;
  border: 2px solid #3e5c76;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}

.btn-connexion {
  width: 150px;
  color: #3e5c76;
  background-color: white;
  margin-right: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}
.btn-connexion:hover {
  background-color: #3e5c76;
  color: white;
  font-weight: 400;
}
.btn-inscription:hover {
  background-color: #ffffff;
  color: #3e5c76;
  font-weight: 500;
}
.btn-deconnexion {
  width: 130px;
  height: 40px;
  color: white;
  background-color: #ff3535;
  border: 1px solid rgb(58, 58, 58);
  font-weight: 400;
  font-size: 15px;
  transition: all 0.3s ease;
}
.username {
  font-size: 18px;
  font-weight: 400;
  margin-right: 20px;
  cursor: none;
}
</style>
