import {
  makeFakeArrayNotifications,
  mockFakeNotification,
} from '../../models/mocks/mock-notification';
import {
  NotificationData,
  NotificationModel,
} from '../../models/notification-model';
import { AddNotificationRepository } from '../protocols/add-notification-repository';
import { LoadNotificationByIdRepository } from '../protocols/load-notification-by-id-repository';
import { LoadNotificationByPageRepository } from '../protocols/load-notification-by-page-repository';
import { UpdateNotificationRepository } from '../protocols/update-notification-repository';

export const mockUpdateNotificationRepository = (): UpdateNotificationRepository => {
  class UpdateNotificationRepositoryStub
    implements UpdateNotificationRepository {
    async updateOne(
      notificationData: NotificationData,
      notificationId: string,
    ): Promise<NotificationModel> {
      return new Promise((resolve) => resolve(this.notificationModel));
    }
    notificationModel = mockFakeNotification();
  }
  return new UpdateNotificationRepositoryStub();
};

export const mockAddNotificationRepository = (): AddNotificationRepository => {
  class AddNotificationRepositoryStub implements AddNotificationRepository {
    notificationModel = mockFakeNotification();
    async add(
      notificationData: Omit<NotificationModel, '_id'>,
    ): Promise<NotificationModel> {
      return new Promise((resolve) => resolve(this.notificationModel));
    }
  }
  return new AddNotificationRepositoryStub();
};

export const mockLoadNotificationByIdRepository = (): LoadNotificationByIdRepository => {
  class LoadNotificationByIdStub implements LoadNotificationByIdRepository {
    notification_id: string;
    notificationModel = mockFakeNotification();
    async loadById(notification_id: string): Promise<NotificationModel> {
      this.notification_id = notification_id;
      if (this.notificationModel !== null) {
        this.notificationModel._id = notification_id;
      }
      return new Promise((resolve) => resolve(this.notificationModel));
    }
  }
  return new LoadNotificationByIdStub();
};
export const mockLoadNotificationByPageRepository = (): LoadNotificationByPageRepository => {
  class LoadNotificationByPageStub implements LoadNotificationByPageRepository {
    notifications = makeFakeArrayNotifications();
    page: number;
    notificationId: string;
    async loadByPage(
      page: number,
      notificationId: string,
    ): Promise<NotificationModel[]> {
      this.notificationId = notificationId;
      this.page = page;
      return new Promise((resolve) =>
        resolve(this.notifications?.slice(0, 10)),
      );
    }
    async countNotificationsByPage(notificationId: string): Promise<number> {
      this.notificationId = notificationId;
      return new Promise((resolve) => resolve(this.notifications?.length));
    }
  }
  return new LoadNotificationByPageStub();
};
