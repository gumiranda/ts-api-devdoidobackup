import { RatingResultModel } from '@/modules/rating/models/rating-result';
import { SaveRatingResultParams } from '@/modules/rating/usecases/save-rating-result/save-rating-result';

export const mockFakeRatingResult = (): RatingResultModel => ({
  ratingId: '5f4d46d97568f749c8f5a8e9',
  ratingFor: '5f4d46d97568f749c8f5a8e9',
  ratingType: 'atendimento',
  createdAt: new Date(),
  ratings: [
    {
      rating: 'any_rating',
      comment: 'Oloko meo',
      stars: 3,
      count: 0,
      percent: 0,
    },
    {
      rating: 'Bom',
      comment: 'Oloko meo',
      stars: 3,
      count: 0,
      percent: 0,
    },
  ],
});

const mockFakeRatingResultData = (
  ratingId: string,
  ratingFor: string,
  userId: string,
  rating: string,
): SaveRatingResultParams => ({
  ratingId,
  ratingFor,
  userId,
  comment: 'Oloko meo',
  rating,
  createdAt: new Date(),
});
export const mockFakeRatingResultSave = (): SaveRatingResultParams => {
  return mockFakeRatingResultData(
    'any_rating_id',
    'any_ratingFor',
    'any_user_id',
    'Bom',
  );
};
