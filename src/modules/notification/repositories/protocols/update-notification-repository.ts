import {
  NotificationData,
  NotificationModel,
} from '../../models/notification-model';

export interface UpdateNotificationRepository {
  notificationModel: NotificationModel;
  updateOne(
    userData: NotificationData,
    userId: string,
  ): Promise<Omit<NotificationModel, 'password'>>;
}
