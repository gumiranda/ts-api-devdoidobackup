import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { Controller } from '@/bin/protocols/controller';
import { LoadNotificationByPageController } from '../../controllers/load-notification-by-page/load-notification-by-page';
import { makeDbLoadNotificationByPage } from '../usecases/load-notification-by-page/db-load-notification-by-page';

export const makeLoadNotificationByPageController = (): Controller => {
  const loadNotificationController = new LoadNotificationByPageController(
    makeDbLoadNotificationByPage(),
  );
  return makeLogControllerDecorator(loadNotificationController);
};
