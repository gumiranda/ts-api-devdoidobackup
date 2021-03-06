import { Controller } from '@/bin/protocols/controller';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
import { CompleteRegisterController } from '../../controllers/complete-register/complete-register-controller';
import { makeDbUpdateUser } from '../usecases/update-user/db-update-user-factory';

export const makeCompleteRegisterController = (): Controller => {
  const requiredFields = [];
  const validationComposite = makeValidationComposite(requiredFields);
  const loginController = new CompleteRegisterController(
    makeDbUpdateUser(),
    validationComposite,
  );
  return makeLogControllerDecorator(loginController);
};
