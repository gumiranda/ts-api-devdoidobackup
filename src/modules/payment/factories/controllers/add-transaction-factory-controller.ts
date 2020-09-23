import { Controller } from '@/bin/protocols/controller';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
import { TransactionController } from '../../controllers/add-transaction/add-transaction-controller';
import { makeDbAddTransaction } from '../usecases/add-transaction/db-add-transaction-factory';
import { makeDbLoadCardById } from '../usecases/load-card-by-id/db-load-card-by-id';
import { makeDbAddCard } from '../usecases/add-card/db-add-card-factory';
import { makeDbUpdateUser } from '../../../user/factories/usecases/update-user/db-update-user-factory';
import { makeDbLoadUserById } from '@/modules/user/factories/usecases/load-user-by-id/db-load-user-by-id';
import { makeDbPayOnce } from '../usecases/pay-once/db-pay-once-factory';

export const makeTransactionController = (): Controller => {
  const dbAddTransaction = makeDbAddTransaction();
  const DbLoadCardById = makeDbLoadCardById();
  const dbPayOnce = makeDbPayOnce();
  const requiredFields = ['value'];
  const validationComposite = makeValidationComposite(requiredFields);
  const transactionController = new TransactionController(
    dbAddTransaction,
    dbPayOnce,
    DbLoadCardById,
    validationComposite,
  );
  return makeLogControllerDecorator(transactionController);
};
