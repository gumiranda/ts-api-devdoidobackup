import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { Controller } from '@/bin/protocols/controller';
import { makeDbUpdateNotification } from '../usecases/update-notification/db-update-notification-factory';
import { UpdateNotificationController } from '@/modules/notification/controllers/update-notification/update-notification';
import { makeValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
export const makeUpdateNotificationController = (): Controller => {
  const requiredFields = ['read'];
  const validationComposite = makeValidationComposite(requiredFields);

  const updateNotificationController = new UpdateNotificationController(
    validationComposite,
    makeDbUpdateNotification(),
  );
  return makeLogControllerDecorator(updateNotificationController);
};
