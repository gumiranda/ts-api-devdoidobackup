import { DbAddCategory } from './db-add-category';
import MockDate from 'mockdate';
import { mockFakeCategory } from '@/modules/category/models/mocks/mock-category';
import { mockAddCategoryRepository } from '@/modules/category/repositories/mocks/mock-category-repository';
import { AddCategoryRepository } from '@/modules/category/repositories/protocols/add-category-repository';

type SutTypes = {
  sut: DbAddCategory;
  addCategoryStub: AddCategoryRepository;
};

const makeSut = (): SutTypes => {
  const addCategoryStub = mockAddCategoryRepository();
  const sut = new DbAddCategory(addCategoryStub);
  return {
    sut,
    addCategoryStub,
  };
};
describe('DbAddCategory', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });

  test('should call AddCategoryRepository with correct values', async () => {
    const { sut, addCategoryStub } = makeSut();
    const categoryData = mockFakeCategory();
    const addCategorySpy = jest.spyOn(addCategoryStub, 'add');
    await sut.add(categoryData);
    expect(addCategorySpy).toHaveBeenCalledWith(categoryData);
  });
  test('should throw if AddCategoryRepository throws', async () => {
    const { sut, addCategoryStub } = makeSut();
    const categoryData = mockFakeCategory();
    jest
      .spyOn(addCategoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.add(categoryData);
    await expect(promise).rejects.toThrow();
  });
});
