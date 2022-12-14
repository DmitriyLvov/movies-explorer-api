const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const { getUserInfo, updateUserInfo } = require('../controllers/users');

const userRouter = Router();
// Получение данных пользователя
userRouter.get('/users/me', getUserInfo);
// Обновление данных пользователя
userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email().min(1),
    }),
  }),
  updateUserInfo,
);

module.exports = userRouter;
