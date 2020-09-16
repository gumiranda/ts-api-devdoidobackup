import { Controller } from '@/bin/protocols/controller';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
import { UpdatePasswordController } from '../../controllers/update-password/update-password-controller';
import { makeDbUpdatePassword } from '../usecases/update-password/db-update-password-factory';

export const makeUpdatePasswordController = (): Controller => {
  const requiredFields = ['oldPassword', 'newPassword'];
  const validationComposite = makeValidationComposite(requiredFields);
  const loginController = new UpdatePasswordController(
    makeDbUpdatePassword(),
    validationComposite,
  );
  return makeLogControllerDecorator(loginController);
};
