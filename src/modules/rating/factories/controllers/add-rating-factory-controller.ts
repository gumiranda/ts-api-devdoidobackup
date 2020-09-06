import { Controller } from '@/bin/protocols/controller';
import { AddRatingController } from '../../controllers/add-rating/add-rating-controller';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { mockValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
import { makeDbAddRating } from '@/modules/rating/factories/usecases/add-rating/db-add-rating-factory';

export const makeAddRatingController = (): Controller => {
  const requiredFields = ['ratingType', 'ratings'];
  const addRatingController = new AddRatingController(
    mockValidationComposite(requiredFields),
    makeDbAddRating(),
  );
  return makeLogControllerDecorator(addRatingController);
};
