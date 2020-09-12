import { Controller } from '@/bin/protocols/controller';
import { SignUpController } from '@/modules/user/controllers/signup/signup-controller';
import { makeDbAddUser } from '@/modules/user/factories/usecases/add-user/db-add-user-factory';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { mockValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';

export const makeSignUpController = (): Controller => {
  const dbAddUser = makeDbAddUser();
  const requiredFields = [
    'email',
    'name',
    'password',
    'passwordConfirmation',
    'coord',
  ];
  const validationComposite = mockValidationComposite(requiredFields);
  const signUpController = new SignUpController(dbAddUser, validationComposite);
  return makeLogControllerDecorator(signUpController);
};
