import axios from 'axios'

// Crée une instance Axios avec la base de l’URL du back-end
const api = axios.create({
  baseURL: 'http://localhost:3000', // à adapter selon ton back-end
  headers: {
    'Content-Type': 'application/json'
  }
})

// Fonctions d’API
export default {
  // Exemple : Récupérer tous les jeux
  getGames() {
    return api.get('/games')
  },

  getGameById(id) {
    return api.get(`/game/${id}`)
  },
  getSessionsByGameId(gameId) {
    return api.get(`/sessions/game/${gameId}`);
  },
  joinSession(id_session, id_user) {
    return api.post('/sessions/join', { id_session, id_user });
  },
  leaveSession(id_session, id_user) {
    return api.post('/sessions/leave', { id_session, id_user })
  },
  getCategories() {
    return api.get('/categories');
  },
  getGamesByCategory(id_category) {
    return api.get(`/games/category/${id_category}`);
  }  
}
