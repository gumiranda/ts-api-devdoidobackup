export const ratingResultSchema = {
  type: 'object',
  properties: {
    ratingId: { type: 'string' },
    ratings: {
      type: 'array',
      items: { $ref: '#/schemas/ratingResultRating' },
    },
    accountId: { type: 'string' },
    ratingType: { type: 'string' },
    date: { type: 'string' },
  },
  required: ['ratingId', 'ratingType', 'ratings', 'date'],
};
