import { MongoRepository } from '@/bin/repository/mongo-repository';
import { ObjectId } from 'mongodb';
import {
  NotificationData,
  NotificationModel,
} from '../models/notification-model';
import { AddNotificationRepository } from './protocols/add-notification-repository';
import { LoadNotificationByIdRepository } from './protocols/load-notification-by-id-repository';
import { LoadNotificationByPageRepository } from './protocols/load-notification-by-page-repository';
import { UpdateNotificationRepository } from './protocols/update-notification-repository';

export class NotificationMongoRepository
  implements
    AddNotificationRepository,
    LoadNotificationByIdRepository,
    UpdateNotificationRepository,
    LoadNotificationByPageRepository {
  constructor(private readonly mongoRepository: MongoRepository) {}
  notificationModel: NotificationModel;
  notification_id: string;
  notifications;
  async add(
    notificationData: Omit<NotificationModel, '_id'>,
  ): Promise<NotificationModel> {
    const result = await this.mongoRepository.add(notificationData);
    return result;
  }
  async updateOne(
    notificationData: NotificationData,
    notificationId: string,
  ): Promise<Omit<NotificationModel, 'password'>> {
    await this.mongoRepository.updateOne(
      {
        _id: new ObjectId(notificationId),
      },
      {
        $set: notificationData,
      },
      { upsert: true },
    );
    const result = await this.mongoRepository.getOne({ _id: notificationId });
    return result;
  }
  async loadById(_id: string): Promise<NotificationModel> {
    const notification = await this.mongoRepository.getById(_id);
    return notification;
  }
  countNotificationsByPage(userFor: string): Promise<number> {
    return this.mongoRepository.getCount({ userFor });
  }
  loadByPage(page: number, userFor: string): Promise<NotificationModel[]> {
    return this.mongoRepository.getPaginate(
      page,
      { userFor },
      { createdAt: -1 },
      10,
      {},
    );
  }
}
