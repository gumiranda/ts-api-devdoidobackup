export type NotificationModel = {
  _id: string;
  content: string;
  type: string;
  userFor: string;
  userBy: string;
  read: boolean;
  createdAt?: Date;
};
export type NotificationsPaginate = {
  notifications: NotificationModel[];
  notificationsCount: number;
};
export type NotificationData = Omit<
  NotificationModel,
  'content' | 'type' | 'userFor' | 'userBy' | '_id' | 'createdAt'
>;
