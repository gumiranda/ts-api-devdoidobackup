import { MongoRepository } from '@/bin/repository/mongo-repository';
import { NotificationMongoRepository } from '@/modules/notification/repositories/notification-mongo-repository';
import { DbLoadNotificationById } from '@/modules/notification/usecases/load-notification-by-id/db/db-load-notification-by-id';
import { LoadNotificationById } from '@/modules/notification/usecases/load-notification-by-id/load-notification-by-id';

export const makeDbLoadNotificationById = (): LoadNotificationById => {
  const mongoRepository = new MongoRepository('notifications');
  const notificationMongoRepository = new NotificationMongoRepository(
    mongoRepository,
  );
  return new DbLoadNotificationById(notificationMongoRepository);
};
