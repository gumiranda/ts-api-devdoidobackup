import { DbAddNotification } from './db-add-notification';
import MockDate from 'mockdate';
import { mockFakeNotification } from '@/modules/notification/models/mocks/mock-notification';
import { mockAddNotificationRepository } from '@/modules/notification/repositories/mocks/mock-notification-repository';
import { AddNotificationRepository } from '@/modules/notification/repositories/protocols/add-notification-repository';
import { mockLoadUserByIdRepository } from '@/modules/user/repositories/mocks/mock-user-repository';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';

type SutTypes = {
  sut: DbAddNotification;
  addNotificationStub: AddNotificationRepository;
  loadUserByIdRepositoryStub: LoadUserByIdRepository;
};

const makeSut = (): SutTypes => {
  const addNotificationStub = mockAddNotificationRepository();
  const loadUserByIdRepositoryStub = mockLoadUserByIdRepository();
  const sut = new DbAddNotification(
    addNotificationStub,
    loadUserByIdRepositoryStub,
  );
  return {
    sut,
    addNotificationStub,
    loadUserByIdRepositoryStub,
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
  test('should call loadUserByIdRepositoryStub with correct values', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut();
    const notificationData = mockFakeNotification();
    const loadUserByIdSpy = jest.spyOn(loadUserByIdRepositoryStub, 'loadById');
    await sut.add(notificationData);
    expect(loadUserByIdSpy).toHaveBeenCalledWith(notificationData.userFor);
  });
  test('should throw if loadUserByIdRepositoryStub throws', async () => {
    const { sut, loadUserByIdRepositoryStub } = makeSut();
    const notificationData = mockFakeNotification();
    jest
      .spyOn(loadUserByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.add(notificationData);
    await expect(promise).rejects.toThrow();
  });
});
