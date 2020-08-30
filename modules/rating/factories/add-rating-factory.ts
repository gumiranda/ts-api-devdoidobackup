import { Controller } from '../../../bin/protocols/controller';
import { AddRatingController } from '../controllers/add-rating/add-rating-controller';
import { makeLogControllerDecorator } from '../../../bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeValidationComposite } from '../../../bin/patterns/factories/usecases/validation/validation-factory';
import { makeDbAddRating } from '../../../bin/patterns/factories/usecases/add-rating/db-add-rating-factory';

export const makeAddRatingController = (): Controller => {
  const requiredFields = ['ratingFor', 'ratings'];
  const addRatingController = new AddRatingController(
    makeValidationComposite(requiredFields),
    makeDbAddRating(),
  );
  return makeLogControllerDecorator(addRatingController);
};
