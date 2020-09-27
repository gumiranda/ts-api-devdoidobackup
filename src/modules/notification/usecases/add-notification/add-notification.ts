import { NotificationModel } from '@/modules/notification/models/notification-model';

export type AddNotificationModel = Omit<NotificationModel, '_id'>;

export type AddNotification = {
  add(data: AddNotificationModel): Promise<NotificationModel>;
};
