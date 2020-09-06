import { AccountMongoRepository } from '@/modules/account/repositories/account-mongo-repository';
import { DbLoadAccountByPage } from '@/modules/account/usecases/load-account-by-page/db/db-load-account-by-page';
import { LoadAccountByPage } from '@/modules/account/usecases/load-account-by-page/load-account-by-page';

export const makeDbLoadAccountByPage = (): LoadAccountByPage => {
  const accountMongoRepository = new AccountMongoRepository();
  return new DbLoadAccountByPage(accountMongoRepository);
};
