export const ratingsSchema = {
  type: 'array',
  items: { $ref: '#/schemas/ratings' },
};
