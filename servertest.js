require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
// ROTAS
const userRouter = require('./modules/user/routes/user-router');
const cardRouter = require('./modules/payment/routes/card-router');
const transactionRouter = require('./modules/payment/routes/transaction-router');
const chatRouter = require('./modules/chat/routes/chat-router');

const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin); // || '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,HEAD,DELETE,OPTIONS',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'content-Type,x-requested-with,Authorization',
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/user', userRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/card', cardRouter);
app.use('/api/chat', chatRouter);
module.exports = app;
