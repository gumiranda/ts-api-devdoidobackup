export const ratingSchema = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    createdAt: {
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
