const router = require('express').Router();
const {
  updateUserById,
  getUserMe,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { updateUserIsValid } = require('../validations/validation');

router.get('/me', auth, getUserMe);

router.patch('/me', auth, updateUserIsValid, updateUserById);

module.exports = router;
