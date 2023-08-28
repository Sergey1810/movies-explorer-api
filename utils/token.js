const jwt = require('jsonwebtoken');
const User = require('../models/users');
const UnauthorizedError = require('../errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

const generateToken = (id) => jwt.sign({ id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

const verifyToken = (token) => {
  const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  const user = User.findById(payload._id);
  if (!user) {
    throw new UnauthorizedError('передан неверный логин или пароль');
  }
  return payload;
};

module.exports = {
  generateToken,
  verifyToken,
};
