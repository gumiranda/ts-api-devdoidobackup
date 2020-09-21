import { Controller } from '@/bin/protocols/controller';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
import { TransactionController } from '../../controllers/add-transaction/add-transaction-controller';

export const makeTransactionController = (): Controller => {
  const dbAddUser = makeDbAddUser();
  const requiredFields = [
    'email',
    'name',
    'password',
    'passwordConfirmation',
    'coord',
  ];
  const validationComposite = makeValidationComposite(requiredFields);
  const signUpController = new TransactionController(
    dbAddUser,
    validationComposite,
  );
  return makeLogControllerDecorator(signUpController);
};
