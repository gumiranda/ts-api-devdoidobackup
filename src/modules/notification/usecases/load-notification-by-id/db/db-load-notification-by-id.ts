import { NotificationModel } from '@/modules/notification/models/notification-model';
import { LoadNotificationByIdRepository } from '@/modules/notification/repositories/protocols/load-notification-by-id-repository';
import { LoadNotificationById } from '../load-notification-by-id';

export class DbLoadNotificationById implements LoadNotificationById {
  constructor(
    private readonly loadNotificationByIdRepository: LoadNotificationByIdRepository,
  ) {}
  async loadById(notification_id: string): Promise<NotificationModel> {
    if (notification_id) {
      const notification = await this.loadNotificationByIdRepository.loadById(
        notification_id,
      );
      if (notification) {
        return notification;
      }
    }
    return null;
  }
}
