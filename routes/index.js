const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-error');
const { loginIsValid, userIsValid } = require('../validations/validation');

router.post('/signin', loginIsValid, login);
router.post('/signup', userIsValid, createUser);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Не корректный путь'));
});

module.exports = router;
