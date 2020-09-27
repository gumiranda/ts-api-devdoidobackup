import { NotificationModel } from '../../models/notification-model';

export interface LoadNotificationByPageRepository {
  notifications: NotificationModel[];
  loadByPage(page: number, userId: string): Promise<NotificationModel[]>;
  countNotificationsByPage(userId: string): Promise<number>;
}
