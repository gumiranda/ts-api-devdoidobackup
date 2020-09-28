import { serverError, ok, forbidden } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { HttpRequest } from '@/bin/protocols/http';
import { InvalidParamError } from '@/bin/errors';
import { LoadChatByPage } from '../../usecases/load-chat-by-page/load-chat-by-page';
import { mockFakeChatsPaginated } from '../../models/mocks/mock-chat';
import { mockLoadChatByPage } from '../../usecases/mocks/mock-chat';
import { LoadChatByPageController } from './load-chat-by-page';
const makeFakeRequest = (): HttpRequest => ({
  params: {
    page: 1,
  },
  userId: 'any_user_id',
});
type SutTypes = {
  sut: LoadChatByPageController;
  loadChatByPageStub: LoadChatByPage;
};

const makeSut = (): SutTypes => {
  const loadChatByPageStub = mockLoadChatByPage();
  const sut = new LoadChatByPageController(loadChatByPageStub);
  return { sut, loadChatByPageStub };
};

describe('LoadUserByPage Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call loadByPage with correct values', async () => {
    const { sut, loadChatByPageStub } = makeSut();
    const loadSpy = jest.spyOn(loadChatByPageStub, 'loadByPage');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, 'any_user_id');
  });
  test('should call load with correct values', async () => {
    const { sut, loadChatByPageStub } = makeSut();
    const loadSpy = jest.spyOn(loadChatByPageStub, 'loadByPage');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, 'any_user_id');
  });
  test('should return 403 if LoadUserById returns null', async () => {
    const { sut, loadChatByPageStub } = makeSut();
    jest
      .spyOn(loadChatByPageStub, 'loadByPage')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('page')));
  });
  test('should return 500 if LoadUserById throws', async () => {
    const { sut, loadChatByPageStub } = makeSut();
    jest.spyOn(loadChatByPageStub, 'loadByPage').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 500 if LoadUserById throws', async () => {
    const { sut, loadChatByPageStub } = makeSut();
    jest.spyOn(loadChatByPageStub, 'loadByPage').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(mockFakeChatsPaginated()));
  });
});
