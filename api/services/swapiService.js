const axios = require('axios');
const SWAPI_BASE_URL = 'https://swapi.dev/api';

class SwapiService {
  
  // Search for people by name
  static async searchPeople(name) {
    try {
      const response = await axios.get(`${SWAPI_BASE_URL}/people/`, {
        params: { search: name }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching people from SWAPI:', error.message);
      throw new Error('Failed to fetch data from Star Wars API');
    }
  }

  // Search for movies by title
  static async searchMovies(title) {
    try {
      const response = await axios.get(`${SWAPI_BASE_URL}/films/`, {
        params: { search: title }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movies from SWAPI:', error.message);
      throw new Error('Failed to fetch data from Star Wars API');
    }
  }

  // Get person by ID with all films details
  static async getPersonById(id) {
    try {
      const response = await axios.get(`${SWAPI_BASE_URL}/people/${id}/`);
      const person = response.data;

      // Fetch all films in parallel
      if (person.films && person.films.length > 0) {
        const filmsData = await Promise.all(
          person.films.map(async filmUrl => {
            const response = await axios.get(filmUrl);
            return response.data;
          })
        );
        person.films = filmsData;
      }

      return person;
    } catch (error) {
      console.error(`Error fetching person ${id} from SWAPI:`, error.message);
      throw new Error('Failed to fetch person data from Star Wars API');
    }
  }

  // Get movie by ID with all characters details
  static async getMovieById(id) {
    try {
      const response = await axios.get(`${SWAPI_BASE_URL}/films/${id}/`);
      const movie = response.data;

      // Fetch all characters in parallel
      if (movie.characters && movie.characters.length > 0) {
        const charactersData = await Promise.all(
          movie.characters.map(async characterUrl => {
            const response = await axios.get(characterUrl);
            return response.data;
          })
        );
        movie.characters = charactersData;
      }

      return movie;
    } catch (error) {
      console.error(`Error fetching movie ${id} from SWAPI:`, error.message);
      throw new Error('Failed to fetch movie data from Star Wars API');
    }
  }

}

module.exports = SwapiService;