export const addRatingParamsSchema = {
  type: 'object',
  properties: {
    ratingType: {
      type: 'string',
    },
    ratings: {
      type: 'array',
      items: { $ref: '#/schemas/ratingDetails' },
    },
  },
  required: ['ratingType', 'ratings'],
};
