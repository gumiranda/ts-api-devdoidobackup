import { Controller } from '../../../bin/protocols/controller';
import { SignUpController } from '../controllers/signup/signup-controller';
import { makeDbAddAccount } from '../../../bin/patterns/factories/usecases/add-account/db-add-account-factory';
import { makeLogControllerDecorator } from '../../../bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeValidationComposite } from '../../../bin/patterns/factories/usecases/validation/validation-factory';

export const makeSignUpController = (): Controller => {
  const dbAddAccount = makeDbAddAccount();
  const requiredFields = ['email', 'name', 'password', 'passwordConfirmation'];
  const validationComposite = makeValidationComposite(requiredFields);
  const signUpController = new SignUpController(
    dbAddAccount,
    validationComposite,
  );
  return makeLogControllerDecorator(signUpController)
};
