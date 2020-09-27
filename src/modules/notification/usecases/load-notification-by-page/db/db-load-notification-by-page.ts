import { NotificationsPaginate } from '@/modules/notification/models/notification-model';
import { LoadNotificationByPageRepository } from '@/modules/notification/repositories/protocols/load-notification-by-page-repository';
import { LoadNotificationByPage } from '../load-notification-by-page';

export class DbLoadNotificationByPage implements LoadNotificationByPage {
  constructor(
    private readonly loadNotificationRepository: LoadNotificationByPageRepository,
  ) {}
  async loadByPage(
    page: number,
    userId: string,
  ): Promise<NotificationsPaginate> {
    const notifications = await this.loadNotificationRepository.loadByPage(
      page,
      userId,
    );
    const notificationsCount = await this.loadNotificationRepository.countNotificationsByPage(
      userId,
    );
    return { notifications, notificationsCount };
  }
}
