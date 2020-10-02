import { Controller } from '@/bin/protocols/controller';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
import { makeDbAddCategory } from '../usecases/add-category/db-add-category-factory';
import { AddCategoryController } from '../../controllers/add-category/add-category';

export const makeAddCategoryController = (): Controller => {
  const requiredFields = ['name'];
  const validationComposite = makeValidationComposite(requiredFields);
  const dbAddCategory = makeDbAddCategory();
  const notificationController = new AddCategoryController(
    validationComposite,
    dbAddCategory,
  );
  return makeLogControllerDecorator(notificationController);
};
