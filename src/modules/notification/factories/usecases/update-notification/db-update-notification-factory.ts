import { MongoRepository } from '@/bin/repository/mongo-repository';
import { NotificationMongoRepository } from '@/modules/notification/repositories/notification-mongo-repository';
import { DbUpdateNotification } from '@/modules/notification/usecases/update-notification/db/db-update-notification';
import { UpdateNotification } from '@/modules/notification/usecases/update-notification/update-notification';

export const makeDbUpdateNotification = (): UpdateNotification => {
  const mongoRepository = new MongoRepository('notifications');
  const notificationMongoRepository = new NotificationMongoRepository(
    mongoRepository,
  );
  return new DbUpdateNotification(notificationMongoRepository);
};
