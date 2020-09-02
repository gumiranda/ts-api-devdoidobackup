export const signupPath = {
  post: {
    tags: ['SignUp'],
    summary: 'Endpoint que cadastra usuário',
    requestBody: {
      description: 'Forneça os dados básicos de cadastro',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signupParams',
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Sucesso',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/account',
          },
        },
      },
    },
    400: {
      $ref: '#/components/badRequest',
    },
    404: {
      $ref: '#/components/notFound',
    },
    403: {
      $ref: '#/components/forbidden',
    },
    500: {
      $ref: '#/components/serverError',
    },
  },
};
