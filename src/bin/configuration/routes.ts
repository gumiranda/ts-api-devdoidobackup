import { Express } from 'express';
import accountRouter from '@/modules/account/routes/login-router';
import ratingRouter from '@/modules/rating/routes/rating-router';
export default async (app: Express): Promise<void> => {
  app.use('/api/account', accountRouter);
  app.use('/api/rating', ratingRouter);
};
