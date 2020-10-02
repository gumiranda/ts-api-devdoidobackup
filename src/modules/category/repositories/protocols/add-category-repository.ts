import { AddCategoryModel, CategoryModel } from '../../models/category-model';

export interface AddCategoryRepository {
  add(categoryData: AddCategoryModel): Promise<CategoryModel>;
}
