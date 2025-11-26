import axios from 'axios';

// Base URL for API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Search functions
export const searchPeople = async (name) => {
  try {
    const response = await api.get('/search/people', { params: { name } });
    return response.data;
  } catch (error) {
    console.error('Error searching people:', error);
    throw error;
  }
};

export const searchMovies = async (title) => {
  try {
    const response = await api.get('/search/movies', { params: { title } });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

// Get person details by ID
export const getPersonById = async (id) => {
  try {
    const response = await api.get(`/search/people/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching person details:', error);
    throw error;
  }
};

// Get movie details by ID
export const getMovieById = async (id) => {
  try {
    const response = await api.get(`/search/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export default api;