import { createRouter, createWebHistory } from 'vue-router'
import Home from './view/Home.vue'
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
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
