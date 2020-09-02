export const ratingResultSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    ratingId: { type: 'string' },
    accountId: { type: 'string' },
    result: { type: 'string' },
    date: { type: 'string' },
  },
};
