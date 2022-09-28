module.exports.errorCatcher = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(err.statusCode)
    .send({ message: statusCode === 500 ? 'Error on server' : message });
  return next();
};
