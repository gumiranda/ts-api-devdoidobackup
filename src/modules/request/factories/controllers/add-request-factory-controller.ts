import { Controller } from '@/bin/protocols/controller';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
import { makeDbAddRequest } from '../usecases/add-request/db-add-request-factory';
import { AddRequestController } from '../../controllers/add-request/add-request';

export const makeAddRequestController = (): Controller => {
  const requiredFields = ['content', 'type', 'userFor'];
  const validationComposite = makeValidationComposite(requiredFields);
  const dbAddRequest = makeDbAddRequest();
  const requestController = new AddRequestController(
    validationComposite,
    dbAddRequest,
  );
  return makeLogControllerDecorator(requestController);
};
