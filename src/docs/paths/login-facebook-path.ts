export const loginFacebookPath = {
  post: {
    tags: ['Login'],
    summary: 'Endpoint que autentica usuário via facebook',
    requestBody: {
      description: 'Forneça os dados básicos de autenticação',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginFacebookParams',
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
            $ref: '#/schemas/token',
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
