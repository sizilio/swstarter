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
    if (!id || id <= 0) {
      throw new Error('Invalid person ID');
    }

    try {
      const personResponse = await axios.get(`${SWAPI_BASE_URL}/people/${id}/`, {
        timeout: 10000,
      });
      const person = personResponse.data;

      // Fetch all films in parallel with graceful failure
      const filmsData = [];
      if (person.films?.length > 0) {
        const filmsResults = await Promise.allSettled(
          person.films.map(filmUrl => axios.get(filmUrl, { timeout: 10000 }))
        );

        filmsResults.forEach(result => {
          if (result.status === 'fulfilled') {
            filmsData.push(result.value.data);
          } else {
            console.warn(`Failed to fetch movie at ${person.films[index]}: ${result.reason?.message}`);
          }
        });
      }

      return {
        ...person,
        films: filmsData,
      };
    } catch (error) {
      console.error(`Error fetching person ${id} from SWAPI:`, error.message);
      throw new Error('Failed to fetch person data from Star Wars API');
    }
  }

  // Get movie by ID with all characters details
  static async getMovieById(id) {
    if (!id || id <= 0) {
      throw new Error('Invalid movie ID');
    }

    try {
      const movieResponse = await axios.get(`${SWAPI_BASE_URL}/films/${id}/`, {
        timeout: 10000,
      });
      const movie = movieResponse.data;

      // Fetch all characters in parallel with graceful failure
      const charactersData = [];
      if (movie.characters?.length > 0) {
        const charactersResults = await Promise.allSettled(
          movie.characters.map(characterUrl => axios.get(characterUrl, { timeout: 10000 }))
        );

        charactersResults.forEach(result => {
          if (result.status === 'fulfilled') {
            charactersData.push(result.value.data);
          } else {
            console.warn(`Failed to fetch person at ${movie.characters[index]}: ${result.reason?.message}`);
          }
        });
      }

      return {
        ...movie,
        characters: charactersData,
      };
    } catch (error) {
      console.error(`Error fetching movie ${id} from SWAPI:`, error.message);
      throw new Error('Failed to fetch movie data from Star Wars API');
    }
  }

}

module.exports = SwapiService;