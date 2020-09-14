export const ratingResultRatingSchema = {
  type: 'object',
  properties: {
    rating: { type: 'string' },
    comment: { type: 'string' },
    count: { type: 'number' },
    percent: { type: 'number' },
    stars: { type: 'number' },
  },
  required: ['rating', 'count', 'percent', 'comment', 'stars'],
};
