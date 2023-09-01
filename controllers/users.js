const bcrypt = require('bcrypt');
const User = require('../models/users');
const { generateToken } = require('../utils/token');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const ConflictError = require('../errors/conflict-error');
const InternalServerError = require('../errors/internal-server-error');

const userBadRequestError = (e, res, next) => {
  if (e.name === 'ValidationError') {
    next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
  } if (e.name === 'CastError') {
    next(new NotFoundError('Пользователь по указанному id не найден.'));
  }
  return next(new InternalServerError('errors'));
};

const getUserMe = (req, res, next) => {
  const { id } = req.user;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        next(new ForbiddenError('Такого пользователя не существует'));
      }
      return res.status(200).send(user);
    })
    .catch((e) => {
      userBadRequestError(e, res, id);
    });
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передан email или пароль');
  }
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь уже существует');
      }
      bcrypt.hash(password, 10, (err, hash) => User.create({ email, password: hash, name })
        .then((users) => {
          res.status(201).send({ name: users.name, email: users.email });
        }));
    })
    .catch(next);
};

const updateUserById = (req, res, next) => {
  const { id } = req.user;
  const updateUser = req.body;
  return User.findByIdAndUpdate(id, updateUser, { new: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((e) => {
      if (e.name === 'MongoServerError') {
        next(new ConflictError('Пользователь с таким email уже существует'));
      }
      next(e);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Не передан email или пароль' });
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(403).send({ message: 'Такого пользователя не существует' });
      }
      bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
        if (!isPasswordMatch) {
          return res.status(403).send({ message: 'Неправильный логин или пароль' });
        }
        const token = generateToken(user._id);
        return res.status(200).send({ token });
      });
      return null;
    })
    .catch((e) => {
      userBadRequestError(e, res);
      return next(e);
    });
  return null;
};

module.exports = {
  createUser,
  updateUserById,
  login,
  getUserMe,
};
