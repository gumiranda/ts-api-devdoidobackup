import { RatingModel } from '../rating';

export const makeFakeRatings = (): RatingModel[] => {
  return [
    {
      ratingType: 'atendimento',
      _id: 'any_id',
      date: new Date(),
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
      date: new Date(),
      ratings: [
        {
          rating: 'Bom',
          stars: 3,
        },
      ],
    },
  ];
};
export const makeFakeRating = (): RatingModel => ({
  ratingType: 'any_entity',
  _id: 'any_id',
  date: new Date(),
  ratings: [
    {
      rating: 'Bom',
      stars: 3,
    },
  ],
});
export const makeFakeRatingWithIdFake = (): RatingModel => ({
  _id: '5f4d46d97568f749c8f5a8e9',
  ratingType: 'atendimento',
  date: new Date(),
  ratings: [
    {
      rating: 'Bom',
      stars: 3,
    },
  ],
});
export const makeFakeAddRating = (): Omit<RatingModel, '_id'> => ({
  ratingType: 'atendimento',
  date: new Date(),
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
