import { Express } from 'express';
import { cors, contentType } from '@/bin/middlewares';
import bodyParser from 'body-parser';

const connectedUsers = {};

export default (app: Express, io): void => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors);
  app.use(contentType);
  app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;
    return next();
  });
};
