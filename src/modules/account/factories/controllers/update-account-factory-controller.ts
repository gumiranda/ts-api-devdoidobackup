import { Controller } from '@/bin/protocols/controller';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { mockValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
import { CompleteRegisterController } from '../../controllers/complete-register/complete-register-controller';
import { makeDbUpdateAccount } from '../usecases/update-account/db-update-account-factory';

export const makeCompleteRegisterController = (): Controller => {
  const requiredFields = ['cpf', 'phone'];
  const validationComposite = mockValidationComposite(requiredFields);
  const loginController = new CompleteRegisterController(
    makeDbUpdateAccount(),
    validationComposite,
  );
  return makeLogControllerDecorator(loginController);
};
