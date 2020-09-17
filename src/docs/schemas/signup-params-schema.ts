export const signupParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
    pushToken: {
      type: 'string',
    },
    pushId: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    role: {
      type: 'string',
    },
    coord: {
      type: 'array',
      items: { type: 'number' },
    },
    password: {
      type: 'string',
    },
    passwordConfirmation: {
      type: 'string',
    },
  },
  required: [
    'email',
    'coord',
    'password',
    'passwordConfirmation',
    'name',
    'pushToken',
    'pushId',
    'role',
  ],
};
