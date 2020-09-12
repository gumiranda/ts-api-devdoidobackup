import { Controller } from '@/bin/protocols/controller';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { mockValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
import { UpdatePasswordController } from '../../controllers/update-password/update-password-controller';
import { makeDbUpdatePassword } from '../usecases/update-password/db-update-password-factory';

export const makeUpdatePasswordController = (): Controller => {
  const requiredFields = ['cpf', 'phone'];
  const validationComposite = mockValidationComposite(requiredFields);
  const loginController = new UpdatePasswordController(
    makeDbUpdatePassword(),
    validationComposite,
  );
  return makeLogControllerDecorator(loginController);
};
