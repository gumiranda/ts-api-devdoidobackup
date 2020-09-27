import { DbLoadNotificationByPage } from './db-load-notification-by-page';
import MockDate from 'mockdate';
import { mockFakeNotificationsPaginated } from '@/modules/notification/models/mocks/mock-notification';
import { mockLoadNotificationByPageRepository } from '@/modules/notification/repositories/mocks/mock-notification-repository';
import { LoadNotificationByPageRepository } from '@/modules/notification/repositories/protocols/load-notification-by-page-repository';
type SutTypes = {
  sut: DbLoadNotificationByPage;
  loadNotificationStub: LoadNotificationByPageRepository;
};
const makeSut = (): SutTypes => {
  const loadNotificationStub = mockLoadNotificationByPageRepository();
  const sut = new DbLoadNotificationByPage(loadNotificationStub);
  return {
    sut,
    loadNotificationStub,
  };
};
describe('DbLoadNotificationByPage', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });
  test('should call LoadNotificationByPageRepository with correct values', async () => {
    const { sut, loadNotificationStub } = makeSut();
    const loadNotificationSpy = jest.spyOn(loadNotificationStub, 'loadByPage');
    await sut.loadByPage(1, 'notification_id');
    expect(loadNotificationSpy).toHaveBeenCalledWith(1, 'notification_id');
  });
  test('should call countNotificationsByPage with correct values', async () => {
    const { sut, loadNotificationStub } = makeSut();
    const countNotificationsByPageSpy = jest.spyOn(
      loadNotificationStub,
      'countNotificationsByPage',
    );
    await sut.loadByPage(1, 'notification_id');
    expect(countNotificationsByPageSpy).toHaveBeenCalledWith('notification_id');
  });
  test('should return notifications on success', async () => {
    const { sut } = makeSut();
    const notifications = await sut.loadByPage(1, 'notification_id');
    expect(notifications).toEqual(mockFakeNotificationsPaginated());
  });
  test('should throw if LoadNotificationByPageRepository throws', async () => {
    const { sut, loadNotificationStub } = makeSut();
    jest
      .spyOn(loadNotificationStub, 'loadByPage')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadByPage(1, 'notification_id');
    await expect(promise).rejects.toThrow();
  });
  test('should throw if LoadNotificationByPageRepository throws', async () => {
    const { sut, loadNotificationStub } = makeSut();
    jest
      .spyOn(loadNotificationStub, 'countNotificationsByPage')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadByPage(1, 'notification_id');
    await expect(promise).rejects.toThrow();
  });
});
