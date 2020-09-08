export const updatePasswordParamsSchema = {
  type: 'object',
  properties: {
    oldPassword: {
      type: 'string',
    },
    newPassword: {
      type: 'string',
    },
  },
  required: ['oldPassword', 'newPassword'],
};
