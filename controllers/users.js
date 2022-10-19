const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const CREATED_STATUS = 201;

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  return bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      email,
      password: hash,
    })
      .then((newUser) => {
        const { NODE_ENV, JWT_SECRET } = process.env;
        const token = jwt.sign(
          { _id: newUser._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'DEV_SECRET',
          { expiresIn: '7d' },
        );
        return res.status(CREATED_STATUS).send({
          name: newUser.name,
          email: newUser.email,
          _id: newUser._id,
          token,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return next(
            new ConflictError(
              'This email existed. You need to use unique email.',
            ),
          );
        }
        return next(err);
      });
  }).catch(next);
};

module.exports.login = (req, res, next) => (
  User.findUserByCredentials(req.body.email, req.body.password)
    .then(({ _id, name, email }) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id },
        NODE_ENV === 'production' ? JWT_SECRET : 'DEV_SECRET',
        { expiresIn: '7d' },
      );
      res.send({
        message: 'Success', token, name, email, _id,
      });
    })
    .catch(next)
);

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
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError(
            'This email existed. You need to use unique email.',
          ),
        );
      }
      return next(err);
    });
};
