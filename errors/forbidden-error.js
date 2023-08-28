class ForbiddenError extends Error {
  constructor(message) {
    super(message || 'попытка удалить чужую карточку');
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
