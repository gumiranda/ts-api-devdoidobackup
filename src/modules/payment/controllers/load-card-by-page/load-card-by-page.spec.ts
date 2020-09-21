import { serverError, ok, forbidden } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { HttpRequest } from '@/bin/protocols/http';
import { InvalidParamError } from '@/bin/errors';
import { mockFakeCardsPaginated } from '../../models/mocks/mock-card';
import { LoadCardByPage } from '../../usecases/load-card-by-page/load-card-by-page';
import { mockLoadCardByPage } from '../../usecases/mocks/mock-card';
import { LoadCardByPageController } from './load-card-by-page';

const makeFakeRequest = (): HttpRequest => ({
  params: {
    page: 1,
  },
  userId: 'any_user_id',
});
type SutTypes = {
  sut: LoadCardByPageController;
  loadCardByPageStub: LoadCardByPage;
};

const makeSut = (): SutTypes => {
  const loadCardByPageStub = mockLoadCardByPage();
  const sut = new LoadCardByPageController(loadCardByPageStub);
  return { sut, loadCardByPageStub };
};

describe('LoadCardByPage Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call loadByPage with correct values', async () => {
    const { sut, loadCardByPageStub } = makeSut();
    const loadSpy = jest.spyOn(loadCardByPageStub, 'loadByPage');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, 'any_user_id');
  });
  test('should call load with correct values', async () => {
    const { sut, loadCardByPageStub } = makeSut();
    const loadSpy = jest.spyOn(loadCardByPageStub, 'loadByPage');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, 'any_user_id');
  });
  test('should return 403 if LoadCardById returns null', async () => {
    const { sut, loadCardByPageStub } = makeSut();
    jest
      .spyOn(loadCardByPageStub, 'loadByPage')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('page')));
  });
  test('should return 500 if LoadCardById throws', async () => {
    const { sut, loadCardByPageStub } = makeSut();
    jest.spyOn(loadCardByPageStub, 'loadByPage').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 500 if LoadCardById throws', async () => {
    const { sut, loadCardByPageStub } = makeSut();
    jest.spyOn(loadCardByPageStub, 'loadByPage').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(mockFakeCardsPaginated()));
  });
});
