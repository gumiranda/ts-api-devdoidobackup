import { mockUpdateNotificationRepository } from '@/modules/notification/repositories/mocks/mock-notification-repository';
import { UpdateNotificationRepository } from '@/modules/notification/repositories/protocols/update-notification-repository';
import MockDate from 'mockdate';
import { DbUpdateNotification } from './db-update-notification';
import { mockFakeNotification } from '../../../models/mocks/mock-notification';

type SutTypes = {
  sut: DbUpdateNotification;
  updateNotificationRepositoryStub: UpdateNotificationRepository;
};

const makeSut = (): SutTypes => {
  const updateNotificationRepositoryStub = mockUpdateNotificationRepository();
  const sut = new DbUpdateNotification(updateNotificationRepositoryStub);
  return {
    sut,
    updateNotificationRepositoryStub,
  };
};

describe('DbUpdateNotification Usecase', () => {
  beforeAll(async () => {
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
  });

  test('Should call UpdateNotificationRepository with correct values', async () => {
    const { sut, updateNotificationRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateNotificationRepositoryStub, 'updateOne');
    await sut.updateNotification(mockFakeNotification(), 'any_notification_id');
    expect(updateSpy).toHaveBeenCalledWith(
      mockFakeNotification(),
      'any_notification_id',
    );
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, updateNotificationRepositoryStub } = makeSut();
    jest
      .spyOn(updateNotificationRepositoryStub, 'updateOne')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.updateNotification(
      mockFakeNotification(),
      'any_notification_id',
    );
    await expect(promise).rejects.toThrow();
  });

  test('Should return an notification on success', async () => {
    const { sut } = makeSut();
    const fakeUpdateObject = mockFakeNotification();
    const notification = await sut.updateNotification(
      fakeUpdateObject,
      'any_notification_id',
    );
    expect(notification.read).toEqual(fakeUpdateObject.read);
    expect(notification.content).toEqual(fakeUpdateObject.content);
  });
});
