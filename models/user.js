const { Schema, model } = require('mongoose');

const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const WrongDataError = require('../errors/wrong-data-err');
const NotAccessError = require('../errors/not-access-err');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        if (!isEmail(email)) {
          throw new WrongDataError(`${email} is not a valid email`);
        }
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
});

userSchema.statics.findUserByCredentials = function checkEmail(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      // Пользователь по email не найден
      if (!user) {
        return Promise.reject(new NotAccessError('Wrong email or password'));
      }
      return bcrypt.compare(password, user.password).then((res) => {
        if (!res) {
          return Promise.reject(new NotAccessError('Wrong email or password'));
        }
        return Promise.resolve({ _id: user._id });
      });
    });
};

module.exports = model('user', userSchema);
