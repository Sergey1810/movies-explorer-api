class ConflictError extends Error {
  constructor(message) {
    super(message || 'при регистрации указан email, который уже существует на сервере');
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
