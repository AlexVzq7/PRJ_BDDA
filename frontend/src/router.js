import { createRouter, createWebHistory } from 'vue-router'
import Home from './view/Home.vue'
import Login from './view/Login.vue'
import Register from './view/Register.vue'
import GameView from './view/GameView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  { path: '/game/:id', 
    name: 'GameView', 
    component: GameView 
  },
  { path: '/login', 
    name: 'Login', 
    component: Login 
  },
  { path: '/register', 
    name: 'Register', 
    component: Register 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
