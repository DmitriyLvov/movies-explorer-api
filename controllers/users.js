const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const RepeatedEmailError = require('../errors/repeated-email-err');

const CREATED_STATUS = 201;

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  return bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      email,
      password: hash,
    })
      .then((newUser) => res.status(CREATED_STATUS).send({
        name: newUser.name,
        email: newUser.email,
        _id: newUser._id,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          return next(
            new RepeatedEmailError(
              'This email existed. You need to use unique email.',
            ),
          );
        }
        return next(err);
      });
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then(({ _id }) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id },
        NODE_ENV === 'production' ? JWT_SECRET : 'DEV_SECRET',
        { expiresIn: '7d' },
      );
      res.send({ message: 'Success', token });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`User with ID ${_id} not found.`);
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`User with ID ${req.user._id} not found.`);
      }
      res.send(user);
    })
    .catch(next);
};
