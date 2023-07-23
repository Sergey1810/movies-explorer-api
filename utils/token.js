const jwt = require('jsonwebtoken');
const User = require('../models/users');
const UnauthorizedError = require('../errors/unauthorized-error');

const JWT_SECRET = 'unique-secret-key';

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

const verifyToken = (token) => {
  const payload = jwt.verify(token, JWT_SECRET);
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
