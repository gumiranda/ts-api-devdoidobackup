export const userSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    pushToken: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    role: {
      type: 'string',
    },
  },
};
