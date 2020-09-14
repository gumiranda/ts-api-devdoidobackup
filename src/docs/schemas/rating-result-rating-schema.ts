export const ratingResultRatingSchema = {
  type: 'object',
  properties: {
    rating: { type: 'string' },
    comments: { type: 'string' },
    count: { type: 'number' },
    percent: { type: 'number' },
    stars: { type: 'number' },
  },
  required: ['rating', 'count', 'percent', 'comment', 'stars'],
};
