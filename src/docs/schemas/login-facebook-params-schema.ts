export const loginFacebookParamsSchema = {
  type: 'object',
  properties: {
    faceId: {
      type: 'string',
    },
    faceToken: {
      type: 'string',
    },
  },
  required: ['faceId', 'faceToken'],
};
