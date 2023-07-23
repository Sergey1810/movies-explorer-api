const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');
const { auth } = require('../middlewares/auth');
const { idIsValid, cardIsValid } = require('../validations/validation');

router.get('/', auth, getMovies);

router.post('/', auth, cardIsValid, createMovie);

router.delete('/:id', auth, idIsValid, deleteMovieById);

module.exports = router;
