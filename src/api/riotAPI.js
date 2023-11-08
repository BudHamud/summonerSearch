import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_APP_URL}/api`,
  withCredentials: true,
});

const userAPI = {
    searchSummoner: async (region, summonerName) => {
      try {
        const response = await api.post('/users', { region, summonerName });
        
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error('Error al obtener el estado del usuario');
      }
    },

    searchGame: async (matchId) => {
      try {
        const response = await api.post('/game', { matchId });
        
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error('Error al obtener el estado de la partida');
      }
    }
  };

export default userAPI;