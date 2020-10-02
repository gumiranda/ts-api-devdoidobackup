import { MongoRepository } from '@/bin/repository/mongo-repository';
import { CategoryMongoRepository } from '@/modules/category/repositories/category-mongo-repository';
import { AddCategory } from '@/modules/category/usecases/add-category/add-category';
import { DbAddCategory } from '@/modules/category/usecases/add-category/db/db-add-category';
export const makeDbAddCategory = (): AddCategory => {
  const mongoRepository = new MongoRepository('categories');
  const notificationMongoRepository = new CategoryMongoRepository(
    mongoRepository,
  );
  return new DbAddCategory(notificationMongoRepository);
};
