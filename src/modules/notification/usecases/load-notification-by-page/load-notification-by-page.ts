import { NotificationsPaginate } from '../../models/notification-model';

export interface LoadNotificationByPage {
  loadByPage(page: number, userId: string): Promise<NotificationsPaginate>;
}
