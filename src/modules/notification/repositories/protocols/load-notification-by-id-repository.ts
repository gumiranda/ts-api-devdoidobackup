import { NotificationModel } from '../../models/notification-model';

export interface LoadNotificationByIdRepository {
  notificationModel: NotificationModel;
  notification_id: string;
  loadById(notification_id: string): Promise<NotificationModel>;
}
