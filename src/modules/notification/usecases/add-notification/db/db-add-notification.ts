import { AddNotificationRepository } from '@/modules/notification/repositories/protocols/add-notification-repository';
import {
  AddNotification,
  AddNotificationModel,
} from '@/modules/notification/usecases/add-notification/add-notification';

export class DbAddNotification implements AddNotification {
  constructor(
    private readonly addNotificationRepository: AddNotificationRepository,
  ) {}
  async add(data: AddNotificationModel): Promise<void> {
    await this.addNotificationRepository.add(data);
  }
}
