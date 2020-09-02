import express from 'express';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';
import helmet from 'helmet';
//EXPRESS RATE LIMIT
import rateLimit from 'express-rate-limit';
import rateLimitStore from '@lykmapipo/rate-limit-mongoose';
import setupSwagger from './swagger';
const app = express();

//rate limiter
const windowMs = 15 * 60 * 1000;
const storeLimiter = rateLimitStore({ windowMs });
const limiter = rateLimit({ storeLimiter, windowMs, max: 100 });
app.use(limiter);
app.use(helmet());

const server = require('http').Server(app);
const io = require('socket.io')(server);
setupSwagger(app);
setupMiddlewares(app, io);
setupRoutes(app);
export { app, server, io };
