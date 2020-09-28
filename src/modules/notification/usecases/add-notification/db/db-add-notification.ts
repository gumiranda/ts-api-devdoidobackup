import OneSignal from '@/bin/helpers/external-apis/onesignal';
import { NotificationModel } from '@/modules/notification/models/notification-model';
import { AddNotificationRepository } from '@/modules/notification/repositories/protocols/add-notification-repository';
import {
  AddNotification,
  AddNotificationModel,
} from '@/modules/notification/usecases/add-notification/add-notification';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';
export class DbAddNotification implements AddNotification {
  constructor(
    private readonly addNotificationRepository: AddNotificationRepository,
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
  ) {}
  async add(data: AddNotificationModel): Promise<NotificationModel> {
    const notification = await this.addNotificationRepository.add(data);
    const userFor = await this.loadUserByIdRepository.loadById(data.userFor);
    const userBy = await this.loadUserByIdRepository.loadById(data.userBy);
    if (userFor?.pushId && userBy?.name) {
      await OneSignal.sendNotification(
        userFor.pushId,
        userBy.name,
        data.content,
      );
    }
    if (notification) {
      return notification;
    }
    return null;
  }
}
