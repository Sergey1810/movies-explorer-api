class UnauthorizedError extends Error {
  constructor(message) {
    super(message || 'передан неверный логин или пароль');
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
