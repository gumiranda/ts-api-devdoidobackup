import { serverError, ok, forbidden } from '@/bin/helpers/http-helper';
import MockDate from 'mockdate';
import { HttpRequest } from '@/bin/protocols/http';
import { InvalidParamError } from '@/bin/errors';
import { LoadNotificationByPage } from '../../usecases/load-notification-by-page/load-notification-by-page';
import { mockFakeNotificationsPaginated } from '../../models/mocks/mock-notification';
import { mockLoadNotificationByPage } from '../../usecases/mocks/mock-notification';
import { LoadNotificationByPageController } from './load-notification-by-page';
const makeFakeRequest = (): HttpRequest => ({
  params: {
    page: 1,
  },
  userId: 'any_user_id',
});
type SutTypes = {
  sut: LoadNotificationByPageController;
  loadNotificationByPageStub: LoadNotificationByPage;
};

const makeSut = (): SutTypes => {
  const loadNotificationByPageStub = mockLoadNotificationByPage();
  const sut = new LoadNotificationByPageController(loadNotificationByPageStub);
  return { sut, loadNotificationByPageStub };
};

describe('LoadUserByPage Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call loadByPage with correct values', async () => {
    const { sut, loadNotificationByPageStub } = makeSut();
    const loadSpy = jest.spyOn(loadNotificationByPageStub, 'loadByPage');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, 'any_user_id');
  });
  test('should call load with correct values', async () => {
    const { sut, loadNotificationByPageStub } = makeSut();
    const loadSpy = jest.spyOn(loadNotificationByPageStub, 'loadByPage');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, 'any_user_id');
  });
  test('should return 403 if LoadUserById returns null', async () => {
    const { sut, loadNotificationByPageStub } = makeSut();
    jest
      .spyOn(loadNotificationByPageStub, 'loadByPage')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('page')));
  });
  test('should return 500 if LoadUserById throws', async () => {
    const { sut, loadNotificationByPageStub } = makeSut();
    jest
      .spyOn(loadNotificationByPageStub, 'loadByPage')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 500 if LoadUserById throws', async () => {
    const { sut, loadNotificationByPageStub } = makeSut();
    jest
      .spyOn(loadNotificationByPageStub, 'loadByPage')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
  test('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(mockFakeNotificationsPaginated()));
  });
});
