const winston = require('winston');
const expressWinston = require('express-winston');

// Логгирование всех запросов
const requestLogger = expressWinston.logger({
  // Место, куда записываются логи (файл, консоль и др)
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
});

module.exports = { requestLogger, errorLogger };
