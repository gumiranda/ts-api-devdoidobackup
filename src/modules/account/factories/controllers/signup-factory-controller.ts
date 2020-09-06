import { Controller } from '@/bin/protocols/controller';
import { SignUpController } from '@/modules/account/controllers/signup/signup-controller';
import { makeDbAddAccount } from '@/modules/account/factories/usecases/add-account/db-add-account-factory';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { mockValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';

export const makeSignUpController = (): Controller => {
  const dbAddAccount = makeDbAddAccount();
  const requiredFields = ['email', 'name', 'password', 'passwordConfirmation'];
  const validationComposite = mockValidationComposite(requiredFields);
  const signUpController = new SignUpController(
    dbAddAccount,
    validationComposite,
  );
  return makeLogControllerDecorator(signUpController);
};
