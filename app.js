const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const { errorCatcher } = require('./middlewares/errorCatcher');
const router = require('./routes');
const NotFoundError = require('./errors/not-found-err');

require('dotenv').config();

// Слушаем 3000 порт
const { PORT = 3000, DB_PATH, NODE_ENV } = process.env;
const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://dlvov.nomoredomains.sbs',
    'https://dmitriylvov.github.io/react-mesto-auth/',
    'http://dlvov.nomoredomains.sbs',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization', 'Access-Control-Allow-Origin'],
  credentials: true,
};

app.use('*', cors(options));
// app.use('*', cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(bodyParser.json());
mongoose.connect(NODE_ENV === 'production' ? DB_PATH : 'mongodb://localhost:27017/moviesdb');

// Включаем логгирование запросов
app.use(requestLogger);

// Маршруты
app.use(router);

// Ощибки авторизации
app.use(errors());

// // Страница 404
app.use((req, res, next) => {
  next(new NotFoundError('404 Page not found'));
});

// Логгирование ошибок
app.use(errorLogger);

// Центральная обработка ошибок
app.use(errorCatcher);

 app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  process.stdout.write(`App listening on port ${PORT}\n`);
});
