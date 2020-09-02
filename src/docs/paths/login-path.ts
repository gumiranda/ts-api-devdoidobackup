export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'Endpoint que autentica usuário',
    requestBody: {
      description: 'Forneça os dados básicos de autenticação',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams',
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
    401: {
      $ref: '#/components/unauthorized',
    },
    500: {
      $ref: '#/components/serverError',
    },
  },
};
