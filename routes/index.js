const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-error');
const { loginIsValid, userIsValid } = require('../validations/validation');
const { auth } = require('../middlewares/auth');

router.post('/signin', loginIsValid, auth, login);
router.post('/signup', userIsValid, auth, createUser);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Не корректный путь'));
});

module.exports = router;
