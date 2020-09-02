export const serverError = {
  description: 'Problema interno do servidor',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};
