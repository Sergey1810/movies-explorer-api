const errorMiddlewares = (err, req, res, next) => {
  if (err.statusCode === 400) {
    return res.status(400).send({ message: 'Не передан email или пароль' });
  } if (err.statusCode === 409) {
    return res.status(409).send({ message: err.message });
  } if (err.statusCode === 403) {
    return res.status(403).send(err.message);
  } if (err.statusCode === 404) {
    return res.status(404).send({ message: err.message });
  } if (err.statusCode === 401) {
    return res.status(401).send({ message: 'Не передан email или пароль' });
  }
  res.status(500).send({ message: 'На сервере произошла ошибка' });
  return next();
};

module.exports = errorMiddlewares;
