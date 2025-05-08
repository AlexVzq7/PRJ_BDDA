import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 👈

const app = createApp(App)

app.use(router) // 👈 Active le router
app.mount('#app')
