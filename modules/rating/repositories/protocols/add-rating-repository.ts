import { AddRatingModel } from '../../usecases/add-rating/add-rating';

export interface AddRatingRepository {
  add(ratingData: AddRatingModel): Promise<void>;
}
