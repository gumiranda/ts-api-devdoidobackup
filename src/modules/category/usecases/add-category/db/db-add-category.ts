import {
  AddCategoryModel,
  CategoryModel,
} from '@/modules/category/models/category-model';
import { AddCategoryRepository } from '@/modules/category/repositories/protocols/add-category-repository';
import { AddCategory } from '@/modules/category/usecases/add-category/add-category';
export class DbAddCategory implements AddCategory {
  constructor(private readonly addCategoryRepository: AddCategoryRepository) {}
  async add(data: AddCategoryModel): Promise<CategoryModel> {
    const category = await this.addCategoryRepository.add(data);
    if (category) {
      return category;
    }
    return null;
  }
}
