import { Controller } from '@/bin/protocols/controller';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
import { makeDbAddNotification } from '../usecases/add-notification/db-add-notification-factory';
import { AddNotificationController } from '../../controllers/add-notification/add-notification';

export const makeAddNotificationController = (): Controller => {
  const requiredFields = ['content', 'type', 'userFor'];
  const validationComposite = makeValidationComposite(requiredFields);
  const dbAddNotification = makeDbAddNotification();
  const notificationController = new AddNotificationController(
    validationComposite,
    dbAddNotification,
  );
  return makeLogControllerDecorator(notificationController);
};
