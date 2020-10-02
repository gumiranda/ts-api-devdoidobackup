import {
  AddCategoryModel,
  CategoryModel,
} from '@/modules/category/models/category-model';
export type AddCategory = {
  categoryModel: CategoryModel;
  add(data: AddCategoryModel): Promise<CategoryModel>;
};
