export type CategoryModel = {
  _id: string;
  name: string;
  active: boolean;
  createdAt: Date;
};
export type AddCategoryModel = Omit<CategoryModel, '_id'>;
