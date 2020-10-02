import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import MockDate from 'mockdate';
import { Collection } from 'mongodb';
import { AddCategoryModel, CategoryModel } from '../models/category-model';
import { mockFakeAddCategory } from '../models/mocks/mock-category';
import { CategoryMongoRepository } from './category-mongo-repository';
let categoryCollection: Collection;

const makeCategory = async (): Promise<CategoryModel> => {
  let category = mockFakeAddCategory();
  const { ops } = await categoryCollection.insertOne(category);
  return ops[0];
};
let categoryAdd: AddCategoryModel;
const makeSut = (): CategoryMongoRepository => {
  const mongoRepository = new MongoRepository('categories');
  return new CategoryMongoRepository(mongoRepository);
};
describe('Category Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    categoryCollection = await MongoHelper.getCollection('categories');
    await categoryCollection.deleteMany({});
    categoryAdd = mockFakeAddCategory();
  });

  test('Should return an category add success', async () => {
    const sut = makeSut();
    const category = await sut.add(categoryAdd);
    expect(category).toBeTruthy();
    expect(category._id).toBeTruthy();
    expect(category.name).toBe(categoryAdd.name);
  });
});
