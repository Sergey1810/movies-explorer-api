const Movie = require('../models/movies');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');
const InternalServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found-error');

const cardsBadRequestError = (e, res, next) => {
  if (e.name === 'ValidationError') {
    next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
  } if (e.name === 'CastError') {
    next(new BadRequestError('Карточка с указанным id не найдена.'));
  }
  next(new InternalServerError('На сервере произошла ошибка'));
};

const getMovies = (req, res, next) => Movie.find({})
  .then((movies) => res.status(200).send(movies))
  .catch((e) => {
    cardsBadRequestError(e, res, next);
  });

const createMovie = (req, res, next) => {
  const owner = req.user.id;
  const newMovieData = req.body;
  return Movie.create({ ...newMovieData, owner })
    .then((newMovie) => res.status(201).send(newMovie))
    .catch((e) => {
      cardsBadRequestError(e, res, next);
    });
};

const deleteMovieById = (req, res, next) => {
  const owner = req.user.id;
  const { id } = req.params;
  Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Переданы некорректные данные при удалении фильма.'));
      }
      if (movie.owner.toString() === owner) {
        return Movie.findByIdAndRemove(movie.id)
          .then((movieRemove) => {
            res.status(200).send({ data: movieRemove });
          });
      }
      return next(new ForbiddenError('Переданы некорректные данные при удалении фильма.'));
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
