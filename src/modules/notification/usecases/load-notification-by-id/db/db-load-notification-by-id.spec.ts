import { DbLoadNotificationById } from './db-load-notification-by-id';
import faker from 'faker-br';
import { LoadNotificationByIdRepository } from '@/modules/notification/repositories/protocols/load-notification-by-id-repository';
import { mockLoadNotificationByIdRepository } from '@/modules/notification/repositories/mocks/mock-notification-repository';
type SutTypes = {
  sut: DbLoadNotificationById;
  loadNotificationByIdRepositoryStub: LoadNotificationByIdRepository;
};
let notification_id: string;
const makeSut = (): SutTypes => {
  const loadNotificationByIdRepositoryStub = mockLoadNotificationByIdRepository();
  const sut = new DbLoadNotificationById(loadNotificationByIdRepositoryStub);
  return {
    sut,
    loadNotificationByIdRepositoryStub,
  };
};
describe('DbLoadNotificationById tests', () => {
  beforeEach(() => {
    notification_id = faker.random.uuid();
  });

  test('should call LoadNotificationByIdRepository with correct values', async () => {
    const { sut, loadNotificationByIdRepositoryStub } = makeSut();
    await sut.loadById(notification_id);
    expect(loadNotificationByIdRepositoryStub.notification_id).toBe(
      notification_id,
    );
  });
  test('should return null if LoadNotificationByIdRepository returns null', async () => {
    const { sut, loadNotificationByIdRepositoryStub } = makeSut();
    loadNotificationByIdRepositoryStub.notificationModel = null;
    const notification = await sut.loadById(notification_id);
    expect(notification).toBeNull();
  });
  test('should return notification if LoadNotificationByIdRepository returns an notification', async () => {
    const { sut, loadNotificationByIdRepositoryStub } = makeSut();
    const notification = await sut.loadById(notification_id);
    expect(notification).toEqual(
      loadNotificationByIdRepositoryStub.notificationModel,
    );
  });

  test('Should throw if LoadNotificationByIdRepository throws', async () => {
    const { sut, loadNotificationByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadNotificationByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );
    const promise = sut.loadById(notification_id);
    await expect(promise).rejects.toThrow();
  });
});
