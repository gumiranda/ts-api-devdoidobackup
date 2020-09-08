export const updateUserParamsSchema = {
  type: 'object',
  properties: {
    cpf: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
  },
  required: ['cpf', 'phone'],
};
