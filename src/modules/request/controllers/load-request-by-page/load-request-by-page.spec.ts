import { serverError, ok, forbidden } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { HttpRequest } from '@/bin/protocols/http';
import { InvalidParamError } from '@/bin/errors';
import { LoadRequestByPage } from '../../usecases/load-request-by-page/load-request-by-page';
import { mockFakeRequestsPaginated } from '../../models/mocks/mock-request';
import { mockLoadRequestByPage } from '../../usecases/mocks/mock-request';
import { LoadRequestByPageController } from './load-request-by-page';
const makeFakeRequest = (): HttpRequest => ({
  params: {
    page: 1,
  },
  userId: 'any_user_id',
});
type SutTypes = {
  sut: LoadRequestByPageController;
  loadRequestByPageStub: LoadRequestByPage;
};

const makeSut = (): SutTypes => {
  const loadRequestByPageStub = mockLoadRequestByPage();
  const sut = new LoadRequestByPageController(loadRequestByPageStub);
  return { sut, loadRequestByPageStub };
};

describe('LoadUserByPage Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call loadByPage with correct values', async () => {
    const { sut, loadRequestByPageStub } = makeSut();
    const loadSpy = jest.spyOn(loadRequestByPageStub, 'loadByPage');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, 'any_user_id');
  });
  test('should call load with correct values', async () => {
    const { sut, loadRequestByPageStub } = makeSut();
    const loadSpy = jest.spyOn(loadRequestByPageStub, 'loadByPage');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, 'any_user_id');
  });
  test('should return 403 if LoadUserById returns null', async () => {
    const { sut, loadRequestByPageStub } = makeSut();
    jest
      .spyOn(loadRequestByPageStub, 'loadByPage')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('page')));
  });
  test('should return 500 if LoadUserById throws', async () => {
    const { sut, loadRequestByPageStub } = makeSut();
    jest
      .spyOn(loadRequestByPageStub, 'loadByPage')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 500 if LoadUserById throws', async () => {
    const { sut, loadRequestByPageStub } = makeSut();
    jest
      .spyOn(loadRequestByPageStub, 'loadByPage')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(mockFakeRequestsPaginated()));
  });
});
