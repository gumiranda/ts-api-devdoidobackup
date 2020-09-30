import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { Controller } from '@/bin/protocols/controller';
import { makeDbUpdateRequest } from '../usecases/update-request/db-update-request-factory';
import { UpdateRequestController } from '@/modules/request/controllers/update-request/update-request';
import { makeValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
export const makeUpdateRequestController = (): Controller => {
  const requiredFields = ['read'];
  const validationComposite = makeValidationComposite(requiredFields);

  const updateRequestController = new UpdateRequestController(
    validationComposite,
    makeDbUpdateRequest(),
  );
  return makeLogControllerDecorator(updateRequestController);
};
