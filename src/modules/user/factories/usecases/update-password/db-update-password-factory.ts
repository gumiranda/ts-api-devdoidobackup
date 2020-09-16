import { MongoRepository } from '@/bin/repository/mongo-repository';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
import { UpdatePassword } from '@/modules/user/usecases/update-password/update-password';
import { DbUpdatePassword } from '@/modules/user/usecases/update-password/db/db-update-password';
import { BcryptAdapter } from '@/bin/infra/cryptography/bcrypt-adapter/bcrypt-adapter';

export const makeDbUpdatePassword = (): UpdatePassword => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const mongoRepository = new MongoRepository('users');
  const userMongoRepository = new UserMongoRepository(mongoRepository);
  return new DbUpdatePassword(
    userMongoRepository,
    userMongoRepository,
    bcryptAdapter,
  );
};
