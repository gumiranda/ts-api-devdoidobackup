import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { Controller } from '@/bin/protocols/controller';
import { DeleteCardByIdController } from '../../controllers/delete-card-by-id/delete-card-by-id';
import { makeDbDeleteCardById } from '../usecases/delete-card-by-id/db-delete-card-by-id';

export const makeDeleteCardByIdController = (): Controller => {
  const loadCardController = new DeleteCardByIdController(
    makeDbDeleteCardById(),
  );
  return makeLogControllerDecorator(loadCardController);
};
