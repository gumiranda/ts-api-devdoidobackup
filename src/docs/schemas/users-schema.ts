export const usersSchema = {
  type: 'array',
  items: { $ref: '#/schemas/users' },
};
