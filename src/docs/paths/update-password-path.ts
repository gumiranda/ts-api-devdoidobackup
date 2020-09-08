export const updatePasswordPath = {
  put: {
    security: [{ apiKeyAuth: [] }],
    tags: ['User'],
    summary: 'Endpoint que muda a senha do usuário',
    requestBody: {
      description: 'Forneça a senha atual e a nova senha',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/updatePasswordParams',
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
