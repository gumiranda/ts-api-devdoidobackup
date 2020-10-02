import { CategoryModel } from '../../models/category-model';
import { mockFakeCategory } from '../../models/mocks/mock-category';
import { AddCategoryRepository } from '../protocols/add-category-repository';

export const mockAddCategoryRepository = (): AddCategoryRepository => {
  class AddCategoryRepositoryStub implements AddCategoryRepository {
    categoryModel = mockFakeCategory();
    async add(categoryData: CategoryModel): Promise<CategoryModel> {
      return new Promise((resolve) => resolve(this.categoryModel));
    }
  }
  return new AddCategoryRepositoryStub();
};
