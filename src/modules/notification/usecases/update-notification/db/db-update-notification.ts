import {
  NotificationData,
  NotificationModel,
} from '@/modules/notification/models/notification-model';
import { UpdateNotificationRepository } from '@/modules/notification/repositories/protocols/update-notification-repository';
import { UpdateNotification } from '../update-notification';

export class DbUpdateNotification implements UpdateNotification {
  constructor(
    private readonly updateNotificationRepository: UpdateNotificationRepository,
  ) {}
  async updateNotification(
    data: NotificationData,
    notificationId: string,
  ): Promise<NotificationModel> {
    const notificationResult = await this.updateNotificationRepository.updateOne(
      data,
      notificationId,
    );
    return notificationResult;
  }
}
