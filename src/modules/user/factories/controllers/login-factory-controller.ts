import { Controller } from '@/bin/protocols/controller';
import { LoginController } from '@/modules/user/controllers/login/login-controller';
import { makeDbAuthentication } from '@/bin/patterns/factories/usecases/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { mockValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';

export const makeLoginController = (): Controller => {
  const authentication = makeDbAuthentication();
  const requiredFields = ['email', 'password'];
  const validationComposite = mockValidationComposite(requiredFields);
  const loginController = new LoginController(
    validationComposite,
    authentication,
  );
  return makeLogControllerDecorator(loginController);
};
