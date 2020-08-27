require('dotenv').config();
import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import variables from './bin/configuration/variables';
import helmet from 'helmet';

// EXPRESS BRUTE FORCE
import ExpressBrute from 'express-brute';
import MongooseStore from 'express-brute-mongoose';
import BruteForceSchema from 'express-brute-mongoose/dist/schema';

//EXPRESS RATE LIMIT
import rateLimit from 'express-rate-limit';
import rateLimitStore from '@lykmapipo/rate-limit-mongoose';

// ROTAS
import userRouter from './modules/user/routes/user-router';
import cardRouter from './modules/payment/routes/card-router';
import chatRouter from './modules/chat/routes/chat-router';
import transactionRouter from './modules/payment/routes/transaction-router';

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// eslint-disable-next-line no-unused-vars
const connectedUsers = {};

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  return next();
});
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin), // || '*');
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
app.use(helmet());

mongoose.connect(variables.Database.connection, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

//brute force
const model = mongoose.model(
  'bruteforce',
  new mongoose.Schema(BruteForceSchema),
);
const store = new MongooseStore(model);
const bruteForce = new ExpressBrute(store);

//rate limiter
const windowMs = 15 * 60 * 1000;
const storeLimiter = rateLimitStore({ windowMs });
const limiter = rateLimit({ storeLimiter, windowMs, max: 100 });

app.use(limiter);

app.use('/api/user', bruteForce.prevent, userRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/card', cardRouter);
app.use('/api/chat', chatRouter);

const port = process.env.PORT || 3333;

server.listen(port, () => {
  io.on('connection', async (socket) => {
    const { token } = socket.handshake.query;
    const decoded = await jwt.verify(token, variables.Security.secretKey);
    connectedUsers[decoded.user._id] = socket.id;
    console.log(decoded.user._id, 'conectado');
    socket.on('disconnect', async () => {
      connectedUsers[decoded.user._id] = null;
    });
  });

  console.info(`Servidor rodando na porta ${port}`);
});
