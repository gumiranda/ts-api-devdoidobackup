export const saveRatingParamsSchema = {
  type: 'object',
  properties: {
    rating: {
      type: 'string',
    },
  },
  required: ['rating'],
};
