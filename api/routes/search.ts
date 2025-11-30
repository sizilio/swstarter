import express, { Router } from 'express';
import SearchController from '../controllers/searchController';

const router: Router = express.Router();

// Search routes
router.get('/people', SearchController.searchPeople);
router.get('/movies', SearchController.searchMovies);

// Detail routes
router.get('/people/:id', SearchController.getPersonDetails);
router.get('/movies/:id', SearchController.getMovieDetails);

export default router;
