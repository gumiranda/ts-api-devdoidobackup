export const ratingSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
    ratingType: {
      type: 'string',
    },
    ratings: {
      type: 'array',
      items: { $ref: '#/schemas/ratingDetails' },
    },
  },
};
