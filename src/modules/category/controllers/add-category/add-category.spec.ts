import { HttpRequest } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import { badRequest, serverError, createdOk } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { mockValidation } from '@/bin/test/mock-validation';
import { mockAddCategory } from '../../usecases/mocks/mock-category';
import { AddCategory } from '../../usecases/add-category/add-category';
import {
  mockFakeAddCategory,
  mockFakeCategory,
} from '../../models/mocks/mock-category';
import { AddCategoryController } from './add-category';
type SutTypes = {
  sut: AddCategoryController;
  addCategoryStub: AddCategory;
  validatorStub: Validation;
};

const makeSut = (): SutTypes => {
  const validatorStub = mockValidation();
  const addCategoryStub = mockAddCategory();
  const sut = new AddCategoryController(validatorStub, addCategoryStub);
  return { sut, validatorStub, addCategoryStub };
};
export const makeFakeCategoryRequest = (): HttpRequest => ({
  body: mockFakeAddCategory(),
});
let categoryRequest: HttpRequest;
describe('AddCategory Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  beforeEach(async () => {
    categoryRequest = makeFakeCategoryRequest();
  });
  test('should call Validation with correct values', async () => {
    const { sut, validatorStub } = makeSut();
    const validatorSpy = jest.spyOn(validatorStub, 'validate');
    await sut.handle(categoryRequest);
    expect(validatorSpy).toHaveBeenCalledWith(categoryRequest.body);
  });
  test('should return 400 if validation fails', async () => {
    const { sut, validatorStub } = makeSut();
    jest.spyOn(validatorStub, 'validate').mockReturnValueOnce([new Error()]);
    const httpResponse = await sut.handle(categoryRequest);
    expect(httpResponse).toEqual(badRequest([new Error()]));
  });
  test('should call AddCategory with correct values', async () => {
    const { sut, addCategoryStub } = makeSut();
    const addCategorySpy = jest.spyOn(addCategoryStub, 'add');
    await sut.handle(categoryRequest);
    expect(addCategorySpy).toHaveBeenCalledWith(categoryRequest.body);
  });
  test('should return 500 if AddCategory throws', async () => {
    const { sut, addCategoryStub } = makeSut();
    jest
      .spyOn(addCategoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const httpResponse = await sut.handle(categoryRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 201 on success', async () => {
    const { sut, addCategoryStub } = makeSut();
    const httpResponse = await sut.handle(categoryRequest);
    expect(httpResponse).toEqual(createdOk(addCategoryStub.categoryModel));
  });
});
