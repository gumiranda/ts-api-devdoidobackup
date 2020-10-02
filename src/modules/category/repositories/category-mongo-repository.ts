import { MongoRepository } from '@/bin/repository/mongo-repository';
import { AddCategoryModel, CategoryModel } from '../models/category-model';
import { AddCategoryRepository } from './protocols/add-category-repository';

export class CategoryMongoRepository implements AddCategoryRepository {
  constructor(private readonly mongoRepository: MongoRepository) {}
  categoryModel: CategoryModel;
  async add(categoryData: AddCategoryModel): Promise<CategoryModel> {
    const result = await this.mongoRepository.add(categoryData);
    return result;
  }
}
