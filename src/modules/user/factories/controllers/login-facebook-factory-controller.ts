import { Controller } from '@/bin/protocols/controller';
import { makeValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { LoginFacebookController } from '../../controllers/login-facebook/login-facebook-controller';
import { makeDbAuthenticationFacebook } from '../usecases/login-facebook/db-authentication-facebook-factory';

export const makeLoginFacebookController = (): Controller => {
  const authentication = makeDbAuthenticationFacebook();
  const requiredFields = ['faceId', 'faceToken'];
  const validationComposite = makeValidationComposite(requiredFields);
  const loginController = new LoginFacebookController(
    validationComposite,
    authentication,
  );
  return makeLogControllerDecorator(loginController);
};
