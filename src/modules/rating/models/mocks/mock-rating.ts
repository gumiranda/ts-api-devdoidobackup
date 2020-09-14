import { RatingModel } from '@/modules/rating/models/rating';

export const mockFakeRatings = (): RatingModel[] => {
  return [
    {
      ratingType: 'atendimento',
      _id: 'any_id',
      createdAt: new Date(),
      ratings: [
        {
          rating: 'Bom',

          stars: 3,
        },
      ],
    },
    {
      ratingType: 'educação',
      _id: 'other_id',
      createdAt: new Date(),
      ratings: [
        {
          rating: 'Bom',

          stars: 3,
        },
      ],
    },
  ];
};
export const mockFakeRating = (): RatingModel => ({
  ratingType: 'any_entity',
  _id: 'any_id',
  createdAt: new Date(),
  ratings: [
    {
      rating: 'Bom',

      stars: 3,
    },
  ],
});
export const mockFakeRatingWithIdFake = (_id: string): RatingModel => ({
  _id,
  ratingType: 'atendimento',
  createdAt: new Date(),
  ratings: [
    {
      rating: 'any_rating',

      stars: 3,
    },
    {
      rating: 'Bom',

      stars: 3,
    },
  ],
});
export const mockFakeAddRating = (): Omit<RatingModel, '_id'> => ({
  ratingType: 'atendimento',
  createdAt: new Date(),
  ratings: [
    {
      rating: 'Bom',
      stars: 3,
    },
    {
      rating: 'Ótimo',
      stars: 4,
    },
  ],
});
