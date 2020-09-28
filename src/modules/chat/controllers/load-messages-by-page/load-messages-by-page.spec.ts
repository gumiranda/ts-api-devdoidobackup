import { serverError, ok, forbidden } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { HttpRequest } from '@/bin/protocols/http';
import { InvalidParamError } from '@/bin/errors';
import { LoadMessagesByPage } from '../../usecases/load-messages-by-page/load-messages-by-page';
import { mockLoadMessagesByPage } from '../../usecases/mocks/mock-chat';
import { LoadMessagesByPageController } from './load-messages-by-page';
import { mockFakeMessagesPaginated } from '../../models/mocks/mock-chat';

const makeFakeRequest = (): HttpRequest => ({
  params: {
    page: 1,
    chatId: 'any_id',
  },
  userId: 'any_user_id',
});
type SutTypes = {
  sut: LoadMessagesByPageController;
  loadMessagesByPageStub: LoadMessagesByPage;
};

const makeSut = (): SutTypes => {
  const loadMessagesByPageStub = mockLoadMessagesByPage();
  const sut = new LoadMessagesByPageController(loadMessagesByPageStub);
  return { sut, loadMessagesByPageStub };
};

describe('LoadUserByPage Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call loadByPage with correct values', async () => {
    const { sut, loadMessagesByPageStub } = makeSut();
    const loadSpy = jest.spyOn(loadMessagesByPageStub, 'loadMessagesByPage');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, 'any_id', 'any_user_id');
  });
  test('should call load with correct values', async () => {
    const { sut, loadMessagesByPageStub } = makeSut();
    const loadSpy = jest.spyOn(loadMessagesByPageStub, 'loadMessagesByPage');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, 'any_id', 'any_user_id');
  });
  test('should return 403 if LoadUserById returns null', async () => {
    const { sut, loadMessagesByPageStub } = makeSut();
    jest
      .spyOn(loadMessagesByPageStub, 'loadMessagesByPage')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('chatId')));
  });
  test('should return 500 if LoadUserById throws', async () => {
    const { sut, loadMessagesByPageStub } = makeSut();
    jest
      .spyOn(loadMessagesByPageStub, 'loadMessagesByPage')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 500 if LoadUserById throws', async () => {
    const { sut, loadMessagesByPageStub } = makeSut();
    jest
      .spyOn(loadMessagesByPageStub, 'loadMessagesByPage')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(mockFakeMessagesPaginated()));
  });
});
