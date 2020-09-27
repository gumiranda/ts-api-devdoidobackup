import { MongoRepository } from '@/bin/repository/mongo-repository';
import { NotificationMongoRepository } from '@/modules/notification/repositories/notification-mongo-repository';
import { DbLoadNotificationByPage } from '@/modules/notification/usecases/load-notification-by-page/db/db-load-notification-by-page';
import { LoadNotificationByPage } from '@/modules/notification/usecases/load-notification-by-page/load-notification-by-page';

export const makeDbLoadNotificationByPage = (): LoadNotificationByPage => {
  const mongoRepository = new MongoRepository('notifications');
  const notificationMongoRepository = new NotificationMongoRepository(
    mongoRepository,
  );
  return new DbLoadNotificationByPage(notificationMongoRepository);
};
