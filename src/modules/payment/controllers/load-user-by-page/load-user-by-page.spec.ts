import { serverError, ok, forbidden } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { HttpRequest } from '@/bin/protocols/http';
import { InvalidParamError } from '@/bin/errors';
import { LoadUserByPageController } from '@/modules/user/controllers/load-user-by-page/load-user-by-page';
import { LoadUserByPage } from '@/modules/user/usecases/load-user-by-page/load-user-by-page';
import { mockLoadUserByPage } from '@/modules/user/usecases/mocks/mock-user';
import { mockFakeUsersPaginated } from '@/modules/user/models/mocks/mock-user';
const makeFakeRequest = (): HttpRequest => ({
  params: {
    page: 1,
  },
  userId: 'any_user_id',
});
type SutTypes = {
  sut: LoadUserByPageController;
  loadUserByPageStub: LoadUserByPage;
};

const makeSut = (): SutTypes => {
  const loadUserByPageStub = mockLoadUserByPage();
  const sut = new LoadUserByPageController(loadUserByPageStub);
  return { sut, loadUserByPageStub };
};

describe('LoadUserByPage Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call loadByPage with correct values', async () => {
    const { sut, loadUserByPageStub } = makeSut();
    const loadSpy = jest.spyOn(loadUserByPageStub, 'loadByPage');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, 'any_user_id');
  });
  test('should call load with correct values', async () => {
    const { sut, loadUserByPageStub } = makeSut();
    const loadSpy = jest.spyOn(loadUserByPageStub, 'loadByPage');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, 'any_user_id');
  });
  test('should return 403 if LoadUserById returns null', async () => {
    const { sut, loadUserByPageStub } = makeSut();
    jest
      .spyOn(loadUserByPageStub, 'loadByPage')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('page')));
  });
  test('should return 500 if LoadUserById throws', async () => {
    const { sut, loadUserByPageStub } = makeSut();
    jest.spyOn(loadUserByPageStub, 'loadByPage').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 500 if LoadUserById throws', async () => {
    const { sut, loadUserByPageStub } = makeSut();
    jest.spyOn(loadUserByPageStub, 'loadByPage').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(mockFakeUsersPaginated()));
  });
});
