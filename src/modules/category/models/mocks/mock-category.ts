import { CategoryModel } from '../category-model';
import faker from 'faker-br';
export const mockFakeAddCategory = (): Omit<CategoryModel, '_id'> => ({
  name: faker.random.word(),
  active: false,
  createdAt: new Date(),
});
export const mockFakeCategory = (): CategoryModel => ({
  name: faker.random.word(),
  _id: faker.random.uuid(),
  active: false,
  createdAt: new Date(),
});
