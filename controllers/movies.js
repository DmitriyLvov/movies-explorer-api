const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const ForbidError = require('../errors/forbid-err');
const WrongDataError = require('../errors/wrong-data-err');

const CREATED_STATUS = 201;

// Получение сохраненных фильмов для одного автора
module.exports.getSavedMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id })
    .then((movies) => res.send(movies))
    .catch(next);
};
// Создание нового фильма
module.exports.createNewMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((newMovie) => {
      res.status(CREATED_STATUS).send(newMovie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new WrongDataError('Wrong data for new movie creation process'),
        );
      }
      return next(err);
    });
};

// Удаление фильма по ID
module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findOne({ movieId: id, owner: req.user._id })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(`Movie with ID ${id} not found.`);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbidError('You can not delete movie, if you are not owner');
      }
      return Movie.findByIdAndDelete(movie._id).then(() => res.send({ message: `Movie with ID ${id} deleted.` }));
    })
    .catch(next);
};
