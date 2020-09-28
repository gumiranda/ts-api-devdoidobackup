import { MongoRepository } from '@/bin/repository/mongo-repository';
import { NotificationMongoRepository } from '@/modules/notification/repositories/notification-mongo-repository';
import { AddNotification } from '@/modules/notification/usecases/add-notification/add-notification';
import { DbAddNotification } from '@/modules/notification/usecases/add-notification/db/db-add-notification';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
export const makeDbAddNotification = (): AddNotification => {
  const mongoRepository = new MongoRepository('notifications');
  const mongoUserRepository = new MongoRepository('users');
  const userMongoRepository = new UserMongoRepository(mongoUserRepository);
  const notificationMongoRepository = new NotificationMongoRepository(
    mongoRepository,
  );
  return new DbAddNotification(
    notificationMongoRepository,
    userMongoRepository,
  );
};
