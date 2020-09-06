import { serverError, ok, forbidden } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { HttpRequest } from '@/bin/protocols/http';
import { InvalidParamError } from '@/bin/errors';
import { LoadAccountByPageController } from '@/modules/account/controllers/load-account-by-page/load-account-by-page';
import { LoadAccountByPage } from '@/modules/account/usecases/load-account-by-page/load-account-by-page';
import { mockLoadAccountByPage } from '@/modules/account/usecases/mocks/mock-account';
import { mockFakeAccountsPaginated } from '@/modules/account/models/mocks/mock-account';
const makeFakeRequest = (): HttpRequest => ({
  params: {
    page: 1,
  },
  accountId: 'any_account_id',
});
type SutTypes = {
  sut: LoadAccountByPageController;
  loadAccountByPageStub: LoadAccountByPage;
};

const makeSut = (): SutTypes => {
  const loadAccountByPageStub = mockLoadAccountByPage();
  const sut = new LoadAccountByPageController(loadAccountByPageStub);
  return { sut, loadAccountByPageStub };
};

describe('LoadAccountByPage Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call loadByPage with correct values', async () => {
    const { sut, loadAccountByPageStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByPageStub, 'loadByPage');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, 'any_account_id');
  });
  test('should call load with correct values', async () => {
    const { sut, loadAccountByPageStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByPageStub, 'loadByPage');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, 'any_account_id');
  });
  test('should return 403 if LoadAccountById returns null', async () => {
    const { sut, loadAccountByPageStub } = makeSut();
    jest
      .spyOn(loadAccountByPageStub, 'loadByPage')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('page')));
  });
  test('should return 500 if LoadAccountById throws', async () => {
    const { sut, loadAccountByPageStub } = makeSut();
    jest
      .spyOn(loadAccountByPageStub, 'loadByPage')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 500 if LoadAccountById throws', async () => {
    const { sut, loadAccountByPageStub } = makeSut();
    jest
      .spyOn(loadAccountByPageStub, 'loadByPage')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(mockFakeAccountsPaginated()));
  });
});
