import {
  NotificationsPaginate,
  NotificationModel,
} from '../notification-model';
export const mockFakeNotificationData = (): Omit<NotificationModel, '_id'> => ({
  content: 'string',
  userFor: 'string',
  userBy: 'string',
  read: false,
  type: 'string',
  createdAt: new Date(),
});
export const mockFakeNotification = (): NotificationModel => ({
  content: 'string',
  _id: 'any_id',
  userFor: 'string',
  userBy: 'string',
  read: false,
  type: 'string',
  createdAt: new Date(),
});
export const mockFakeNotificationsPaginated = (): NotificationsPaginate => ({
  notifications: makeFakeArrayNotifications().slice(0, 10),
  notificationsCount: makeFakeArrayNotifications().length,
});
export const makeFakeArrayNotifications = (): NotificationModel[] => [
  mockFakeNotification(),
  mockFakeNotification(),
  mockFakeNotification(),
  mockFakeNotification(),
  mockFakeNotification(),
  mockFakeNotification(),
  mockFakeNotification(),
  mockFakeNotification(),
  mockFakeNotification(),
  mockFakeNotification(),
  mockFakeNotification(),
  mockFakeNotification(),
  mockFakeNotification(),
  mockFakeNotification(),
  mockFakeNotification(),
];
export const makeFakeArrayAddNotifications = (): Omit<
  NotificationModel,
  '_id'
>[] => [
  mockFakeNotificationData(),
  mockFakeNotificationData(),
  mockFakeNotificationData(),
  mockFakeNotificationData(),
  mockFakeNotificationData(),
  mockFakeNotificationData(),
  mockFakeNotificationData(),
  mockFakeNotificationData(),
  mockFakeNotificationData(),
  mockFakeNotificationData(),
  mockFakeNotificationData(),
  mockFakeNotificationData(),
  mockFakeNotificationData(),
  mockFakeNotificationData(),
  mockFakeNotificationData(),
];
