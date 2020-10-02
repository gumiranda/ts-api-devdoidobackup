import { AddCategoryModel, CategoryModel } from '../../models/category-model';
import { mockFakeCategory } from '../../models/mocks/mock-category';
import { AddCategory } from '../add-category/add-category';

export const mockAddCategory = (): AddCategory => {
  class AddCategoryStub implements AddCategory {
    categoryModel = mockFakeCategory();
    async add(category: AddCategoryModel): Promise<CategoryModel> {
      return new Promise((resolve) => resolve(this.categoryModel));
    }
  }
  return new AddCategoryStub();
};
