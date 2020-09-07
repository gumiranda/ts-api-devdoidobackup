import { RatingResultModel } from '@/modules/rating/models/rating-result';
import { SaveRatingResultParams } from '@/modules/rating/usecases/save-rating-result/save-rating-result';

export const mockFakeRatingResult = (): RatingResultModel => ({
  ratingId: '5f4d46d97568f749c8f5a8e9',
  ratingType: 'atendimento',
  createdAt: new Date(),
  ratings: [
    {
      rating: 'any_rating',
      stars: 3,
      count: 0,
      percent: 0,
    },
    {
      rating: 'Bom',
      stars: 3,
      count: 0,
      percent: 0,
    },
  ],
});

const mockFakeRatingResultData = (
  ratingId: string,
  accountId: string,
  rating: string,
): SaveRatingResultParams => ({
  ratingId,
  accountId,
  rating,
  createdAt: new Date(),
});
export const mockFakeRatingResultSave = (): SaveRatingResultParams => {
  return mockFakeRatingResultData('any_rating_id', 'any_account_id', 'Bom');
};
