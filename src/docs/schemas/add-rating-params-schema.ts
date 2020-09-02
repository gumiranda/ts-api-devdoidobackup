export const addRatingParamsSchema = {
  type: 'object',
  properties: {
    ratingFor: {
      type: 'string',
    },
    ratings: {
      type: 'array',
      items: { $ref: '#/schemas/ratingDetails' },
    },
  },
  required: ['ratingFor', 'ratings'],
};
