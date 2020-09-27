import { NotificationMongoRepository } from './notification-mongo-repository';
import { MongoHelper } from '@/bin/helpers/db/mongo/mongo-helper';
import { Collection } from 'mongodb';
import { MongoRepository } from '@/bin/repository/mongo-repository';
import MockDate from 'mockdate';
import { mockFakeUserData } from '@/modules/user/models/mocks/mock-user';
import { UserModel } from '@/modules/user/models/user-model';
import {
  mockFakeNotificationData,
  makeFakeArrayNotifications,
} from '../models/mocks/mock-notification';
import { NotificationModel } from '../models/notification-model';

let notificationCollection: Collection;
let userCollection: Collection;

const makeNotification = async (): Promise<NotificationModel> => {
  let notification = mockFakeNotificationData();
  const { ops } = await notificationCollection.insertOne(notification);
  return ops[0];
};
const makeUser = async (): Promise<UserModel> => {
  let user = mockFakeUserData('client');
  user.coord = { type: 'Point', coordinates: user.coord };
  const { ops } = await userCollection.insertOne(user);
  return ops[0];
};
const makeSut = (): NotificationMongoRepository => {
  const mongoRepository = new MongoRepository('notifications');
  return new NotificationMongoRepository(mongoRepository);
};
describe('Notification Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    MockDate.set(new Date());
  });

  afterAll(async () => {
    MockDate.reset();
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    notificationCollection = await MongoHelper.getCollection('notifications');
    userCollection = await MongoHelper.getCollection('users');
    await notificationCollection.deleteMany({});
    await userCollection.deleteMany({});
  });

  test('Should return an notification add success', async () => {
    const sut = makeSut();
    const notification = await sut.add(mockFakeNotificationData());
    expect(notification).toBeTruthy();
    expect(notification._id).toBeTruthy();
    expect(notification.content).toBe('string');
    expect(notification.type).toBe('string');
    expect(notification.userBy).toBe('string');
  });

  test('Should return an notification loaded by id with success', async () => {
    const notification = await makeNotification();
    const sut = makeSut();
    const notificationLoaded = await sut.loadById(notification._id);
    expect(notificationLoaded).toBeTruthy();
    expect(notificationLoaded._id).toBeTruthy();
    expect(notificationLoaded._id).toEqual(notification._id);
  });
  test('Should return an notification loadByPage success', async () => {
    const sut = makeSut();
    const user = await makeUser();
    let arrayNotifications = makeFakeArrayNotifications();
    arrayNotifications.forEach((acc) => {
      delete acc._id;
      acc.userFor = user._id;
    });
    await notificationCollection.insertMany(arrayNotifications);
    const notifications = await sut.loadByPage(1, user._id);
    expect(notifications).toBeTruthy();
    expect(notifications[0]).toBeTruthy();
    expect(notifications[1]).toBeTruthy();
    expect(notifications.length).toBe(10);
  });
  test('Should return an notification countNotificationsByPage success', async () => {
    const sut = makeSut();
    let arrayNotifications = makeFakeArrayNotifications();
    const user = await makeUser();
    arrayNotifications.forEach((acc) => {
      delete acc._id;
      acc.userFor = user._id;
    });
    await notificationCollection.insertMany(arrayNotifications);
    const notificationsCounts = await sut.countNotificationsByPage(user._id);
    expect(notificationsCounts).toBe(15);
  });
  test('Should return 0 on countNotificationsByPage success', async () => {
    const sut = makeSut();
    const user = await makeUser();
    const notificationsCounts = await sut.countNotificationsByPage(user._id);
    expect(notificationsCounts).toBe(0);
  });
  test('Should return an notification updated success', async () => {
    const notification = await makeNotification();
    const sut = makeSut();
    const notificationUpdated = await sut.updateOne(
      {
        read: true,
      },
      notification._id,
    );
    expect(notificationUpdated).toBeTruthy();
    expect(notificationUpdated._id).toBeTruthy();
    expect(notificationUpdated.read).toBe(true);
  });
});
