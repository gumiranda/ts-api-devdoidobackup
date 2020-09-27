import { NotificationModel } from '../../models/notification-model';

export interface LoadNotificationById {
  loadById(_id: string): Promise<NotificationModel>;
}
