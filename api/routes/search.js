const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/searchController');

// Search routes
router.get('/people', SearchController.searchPeople);
router.get('/movies', SearchController.searchMovies);

// Detail routes
router.get('/people/:id', SearchController.getPersonDetails);
router.get('/movies/:id', SearchController.getMovieDetails);

module.exports = router;