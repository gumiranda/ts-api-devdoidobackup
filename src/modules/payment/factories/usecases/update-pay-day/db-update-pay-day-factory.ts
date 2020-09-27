import { MongoRepository } from '@/bin/repository/mongo-repository';
import { DbUpdatePayDay } from '@/modules/payment/usecases/update-pay-day/db/db-update-pay-day';
import { UpdatePayDay } from '@/modules/payment/usecases/update-pay-day/update-pay-day';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
export const makeDbUpdatePayDay = (): UpdatePayDay => {
  const mongoRepositoryUser = new MongoRepository('users');
  const userMongoRepository = new UserMongoRepository(mongoRepositoryUser);
  return new DbUpdatePayDay(userMongoRepository, userMongoRepository);
};
