import {
  makeFakeArrayNotifications,
  mockFakeNotification,
  mockFakeNotificationReaded,
} from '../../models/mocks/mock-notification';
import {
  NotificationData,
  NotificationModel,
  NotificationsPaginate,
} from '../../models/notification-model';
import {
  AddNotification,
  AddNotificationModel,
} from '../add-notification/add-notification';
import { LoadNotificationById } from '../load-notification-by-id/load-notification-by-id';
import { LoadNotificationByPage } from '../load-notification-by-page/load-notification-by-page';
import { UpdateNotification } from '../update-notification/update-notification';

export const mockAddNotification = (): AddNotification => {
  class AddNotificationStub implements AddNotification {
    notificationModel = mockFakeNotification();
    async add(notification: AddNotificationModel): Promise<NotificationModel> {
      return new Promise((resolve) => resolve(this.notificationModel));
    }
  }
  return new AddNotificationStub();
};
export const mockLoadNotificationByPage = (): LoadNotificationByPage => {
  class LoadNotificationByPageStub implements LoadNotificationByPage {
    notifications = makeFakeArrayNotifications();
    page: number;
    notificationId: string;
    loadByPage(
      page: number,
      notificationId: string,
    ): Promise<NotificationsPaginate> {
      this.page = page;
      this.notificationId = notificationId;
      return new Promise((resolve) =>
        resolve({
          notifications: this.notifications.slice(0, 10),
          notificationsCount: this.notifications.length,
        }),
      );
    }
  }
  return new LoadNotificationByPageStub();
};
export const mockLoadNotificationById = (): LoadNotificationById => {
  class LoadNotificationByIdStub implements LoadNotificationById {
    notificationModel = mockFakeNotification();
    _id: string;
    async loadById(_id: string): Promise<NotificationModel> {
      this._id = _id;
      return new Promise((resolve) => resolve(this.notificationModel));
    }
  }
  return new LoadNotificationByIdStub();
};
export const mockUpdateNotification = (): UpdateNotification => {
  class UpdateNotificationStub implements UpdateNotification {
    notificationModel = mockFakeNotificationReaded();
    async updateNotification(
      notification: NotificationData,
      notificationId: string,
    ): Promise<NotificationModel> {
      return new Promise((resolve) => resolve(this.notificationModel));
    }
  }
  return new UpdateNotificationStub();
};
