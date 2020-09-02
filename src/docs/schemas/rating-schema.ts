export const ratingSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
    ratingFor: {
      type: 'string',
    },
    ratings: {
      type: 'array',
      items: { $ref: '#/schemas/ratingDetails' },
    },
  },
};
