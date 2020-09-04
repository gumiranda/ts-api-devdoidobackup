import { RatingResultModel } from '../rating-result';
import { SaveRatingResultParams } from '../../usecases/save-rating-result/save-rating-result';

export const makeFakeRatingResult = (): RatingResultModel => ({
  ratingId: 'any_rating_id',
  ratingType: 'any_ratingType',
  date: new Date(),
  ratings: [
    {
      rating: 'any_rating',
      stars: 3,
      count: 1,
      percent: 50,
    },
    {
      rating: 'other_rating',
      stars: 3,
      count: 10,
      percent: 80,
    },
  ],
});

export const makeFakeRatingResultData = (
  ratingId: string,
  accountId: string,
  rating: string,
): SaveRatingResultParams => ({
  ratingId,
  accountId,
  rating,
  date: new Date(),
});
