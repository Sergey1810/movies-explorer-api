const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('./middlewares/rateLimit');
const routes = require('./routes/index');
const errorMiddlewares = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const PORT = process.env.PORT || 3000;
const { NODE_ENV, DB } = process.env;

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB : 'mongodb://127.0.0.1:27017/bitfilmsdb', {
}).then(() => {
  console.log('db connected');
});

app.use(bodyParser.json());

const allowedCors = [
  'https://sergey.nomoredomains.xyz',
  'http://sergey.nomoredomains.xyz',
  'https://sergeyback.nomoredomains.xyz',
  'http://sergeyback.nomoredomains.xyz',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});

app.use(helmet());
app.use(cors());
app.use(rateLimit);
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(routes);
app.use(errorLogger);
app.use(errors());

app.use(errorMiddlewares);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
