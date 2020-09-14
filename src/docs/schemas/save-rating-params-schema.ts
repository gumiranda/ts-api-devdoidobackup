export const saveRatingParamsSchema = {
  type: 'object',
  properties: {
    rating: {
      type: 'string',
    },
    comment: {
      type: 'string',
    },
  },
  required: ['rating', 'comment'],
};
