import { DbAddNotification } from './db-add-notification';
import MockDate from 'mockdate';
import { mockFakeNotification } from '@/modules/notification/models/mocks/mock-notification';
import { mockAddNotificationRepository } from '@/modules/notification/repositories/mocks/mock-notification-repository';
import { AddNotificationRepository } from '@/modules/notification/repositories/protocols/add-notification-repository';

type SutTypes = {
  sut: DbAddNotification;
  addNotificationStub: AddNotificationRepository;
};

const makeSut = (): SutTypes => {
  const addNotificationStub = mockAddNotificationRepository();
  const sut = new DbAddNotification(addNotificationStub);
  return {
    sut,
    addNotificationStub,
  };
};
describe('DbAddNotification', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });
  afterAll(() => {
    MockDate.reset();
  });

  test('should call AddNotificationRepository with correct values', async () => {
    const { sut, addNotificationStub } = makeSut();
    const notificationData = mockFakeNotification();
    const addNotificationSpy = jest.spyOn(addNotificationStub, 'add');
    await sut.add(notificationData);
    expect(addNotificationSpy).toHaveBeenCalledWith(notificationData);
  });
  test('should throw if AddNotificationRepository throws', async () => {
    const { sut, addNotificationStub } = makeSut();
    const notificationData = mockFakeNotification();
    jest
      .spyOn(addNotificationStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.add(notificationData);
    await expect(promise).rejects.toThrow();
  });
});
