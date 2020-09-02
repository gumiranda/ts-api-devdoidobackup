export const ratingDetailsSchema = {
  type: 'object',
  properties: {
    ratingType: { type: 'string' },
    obs: { type: 'string' },
    stars: { type: 'number' },
  },
};
