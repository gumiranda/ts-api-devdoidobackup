import { Controller } from '../../../bin/protocols/controller';
import { LoginController } from '../controllers/login/login-controller';
import { makeDbAuthentication } from '../../../bin/patterns/factories/usecases/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '../../../bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeValidationComposite } from '../../../bin/patterns/factories/usecases/validation/validation-factory';


export const makeLoginController = (): Controller => {
const authentication = makeDbAuthentication();
const requiredFields = ['email', 'password'];
const validationComposite = makeValidationComposite(requiredFields);
  const loginController = new LoginController(
    validationComposite,
    authentication,
  );
  return makeLogControllerDecorator(loginController)
};
