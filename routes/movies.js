const { Router } = require('express');
const { isURL } = require('validator');
const { celebrate, Joi } = require('celebrate');
const {
  getSavedMovies,
  createNewMovie,
  deleteMovie,
} = require('../controllers/movies');
// const Movie = require('../models/movie');

const movieRouter = Router();
// Получить все сохраненные фильмы для указанного пользователя
movieRouter.get('/movies', getSavedMovies);
// Создание фильма
movieRouter.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(1),
      director: Joi.string().required().min(1),
      duration: Joi.number().required().min(1),
      year: Joi.string().required().min(1),
      description: Joi.string().required().min(1),
      image: Joi.string().required().custom((value, helpers) => {
        if (isURL(value)) {
          return value;
        }
        return helpers.message('Поле image заполнено некорректно (не соответствует формату URL)');
      }),
      trailerLink: Joi.string().required().custom((value, helpers) => {
        if (isURL(value)) {
          return value;
        }
        return helpers.message('Поле trailerLink заполнено некорректно (не соответствует формату URL)');
      }),
      thumbnail: Joi.string().required().custom((value, helpers) => {
        if (isURL(value)) {
          return value;
        }
        return helpers.message('Поле thumbnail заполнено некорректно (не соответствует формату URL)');
      }),
      movieId: Joi.number().required().min(1),
      nameRU: Joi.string().required().min(1),
      nameEN: Joi.string().required().min(1),
    }),
  }),
  createNewMovie,
);
// Удалить фильм по ID
movieRouter.delete(
  '/movies/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().required().length(24),
    }),
  }),
  deleteMovie,
);
// movieRouter.delete('/movies/:id', deleteMovie);

module.exports = movieRouter;
