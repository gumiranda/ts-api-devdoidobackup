import { Express } from 'express';
import userRouter from '@/modules/user/routes/user-router';
import ratingRouter from '@/modules/rating/routes/rating-router';
import ratingResultRouter from '@/modules/rating/routes/rating-result-router';
import notificationRouter from '@/modules/notification/routes/notification-router';
import chatRouter from '@/modules/chat/routes/chat-router';
import cardRouter from '@/modules/payment/routes/card-router';
import transactionRouter from '@/modules/payment/routes/transaction-router';
export default async (app: Express): Promise<void> => {
  app.use('/api/user', userRouter);
  app.use('/api/rating', ratingRouter);
  app.use('/api/ratingResult', ratingResultRouter);
  app.use('/api/transaction', transactionRouter);
  app.use('/api/card', cardRouter);
  app.use('/api/notification', notificationRouter);
  app.use('/api/chat', chatRouter);
};
