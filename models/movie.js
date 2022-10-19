const { Schema, Types, model } = require('mongoose');
const { isURL } = require('validator');
const WrongDataError = require('../errors/wrong-data-err');

const movieSchema = new Schema({
  country: { type: String, required: true },
  director: { type: String, required: true },
  duration: { type: Number, required: true },
  year: { type: Number, required: true },
  description: { type: String, required: true },
  image: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        if (!isURL(link)) {
          throw new WrongDataError(`${link} is not a valid link`);
        }
        return true;
      },
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        if (!isURL(link)) {
          throw new WrongDataError(`${link} is not a valid link`);
        }
        return true;
      },
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        if (!isURL(link)) {
          throw new WrongDataError(`${link} is not a valid link`);
        }
        return true;
      },
    },
  },
  owner: { type: Types.ObjectId, required: true },
  movieId: { type: Number, required: true },
  nameRU: { type: String, required: true },
  nameEN: { type: String, required: true },
});

module.exports = model('movie', movieSchema);
