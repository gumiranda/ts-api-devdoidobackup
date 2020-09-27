import {
  NotificationData,
  NotificationModel,
} from '@/modules/notification/models/notification-model';

export type UpdateNotification = {
  updateNotification(
    data: NotificationData,
    notificationId: string,
  ): Promise<NotificationModel>;
};
