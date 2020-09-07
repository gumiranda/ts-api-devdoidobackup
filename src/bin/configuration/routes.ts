import { Express } from 'express';
import accountRouter from '@/modules/account/routes/account-router';
import ratingRouter from '@/modules/rating/routes/rating-router';
import ratingResultRouter from '@/modules/rating/routes/rating-result-router';
export default async (app: Express): Promise<void> => {
  app.use('/api/user', accountRouter);
  app.use('/api/rating', ratingRouter);
  app.use('/api/ratingResult', ratingResultRouter);
};
