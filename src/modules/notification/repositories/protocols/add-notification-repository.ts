import { AddNotificationModel } from '@/modules/notification/usecases/add-notification/add-notification';
import { NotificationModel } from '../../models/notification-model';

export interface AddNotificationRepository {
  add(notificationData: AddNotificationModel): Promise<NotificationModel>;
}
