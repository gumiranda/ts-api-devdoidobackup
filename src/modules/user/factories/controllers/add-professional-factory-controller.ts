import { Controller } from '@/bin/protocols/controller';
import { makeDbAddUser } from '@/modules/user/factories/usecases/add-user/db-add-user-factory';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
import { AddProfessionalController } from '../../controllers/add-professional/add-professional-controller';

export const makeAddProfessionalController = (): Controller => {
  const dbAddUser = makeDbAddUser();
  const requiredFields = [
    'email',
    'name',
    'services',
    'password',
    'passwordConfirmation',
  ];
  const validationComposite = makeValidationComposite(requiredFields);
  const addProfessionalController = new AddProfessionalController(
    dbAddUser,
    validationComposite,
  );
  return makeLogControllerDecorator(addProfessionalController);
};
